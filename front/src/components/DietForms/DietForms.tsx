import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db, auth } from '../../lib/firebase'; 
import { unidadesMedida } from '@/utils/constants';

import { 
  collection, 
  addDoc,       // Para criar um documento novo
  doc,          // Para referenciar um documento existente
  updateDoc,    // Para atualizar um documento existente
  query, 
  where, 
  limit, 
  getDocs 
} from 'firebase/firestore';import styles from './DietForms.module.css';
import Modal from '../Modal/Modal';
import DietaPreview from '../DietPreview/DietPreview';


import {
  DietaPlan,
  FoodItem,
  Refeicao,
  Aluno,
  ResumoNutricional,
} from "../../types/diet";

type DietaFirestore = Omit<DietaPlan, 'aluno'> & {
  alunoId: string;
  alunoNome: string; // Guardar o nome facilita listagens futuras
  criadoEm: Date;
  resumoNutricional: ResumoNutricional;
  status: 'ativo' | 'inativo' | 'rascunho'; // Adicionando status para controle, incluindo 'rascunho'
  userId: string; // ID do usuário que criou a dieta
};


export const EstruturaRefeicoesForm: React.FC = () => {
   const router = useRouter();
  // Estados principais

   // Estados para os dados que virão do Firebase
  const [alunosBanco, setAlunosBanco] = useState<Aluno[]>([]);
  const [alimentosBanco, setAlimentosBanco] = useState<any[]>([]); // Use 'any' por enquanto ou crie um type para o alimento
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [nomeDieta, setNomeDieta] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [profissionalResponsavel, setProfissionalResponsavel] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [comorbidades, setComorbidades] = useState('');
  const [observacoesAdicionais, setObservacoesAdicionais] = useState('');
  const [rascunhoId, setRascunhoId] = useState<string | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<DietaComResumo | null>(null);


  // Estado para o modal de pré-visualização
  type DietaComResumo = DietaPlan & {
    resumoNutricional: ResumoNutricional;
  };


 

  // Estado para o plano de dieta
  const [dietaPlan, setDietaPlan] = useState<DietaPlan[]>([
    { aluno, nomeDieta, profissionalResponsavel, dataInicio, dataFim, comorbidades: '', refeicoes: [], objetivo: '', observacoesAdicionais: '' }
  ]);

  const [refeicoes, setRefeicoes] = useState<Refeicao[]>([
    { nome: '', horario: '', alimentos: [{ alimento: '', quantidade: 0, unidade: '' }] }
  ]);

  const [resumoNutricional, setResumoNutricional] = useState<ResumoNutricional>({
    caloriasTotais: 0,
    proteinasTotais: 0,
    carboidratosTotais: 0,
    gordurasTotais: 0,
  });

  // Cálculo automático do resumo nutricional
  useEffect(() => {
    let calorias = 0, proteinas = 0, carboidratos = 0, gorduras = 0;

    refeicoes.forEach(refeicao => {
      refeicao.alimentos.forEach(alimento => {
        const alimentoInfo = alimentosBanco.find(a => a.nome === alimento.alimento);
        if (alimentoInfo && alimento.quantidade > 0) {
          const fator = alimento.quantidade / 100; // considerando valores por 100g
          calorias += (alimentoInfo.calorias || 0) * fator;
          proteinas += (alimentoInfo.proteinas || 0) * fator;
          carboidratos += (alimentoInfo.carboidratos || 0) * fator;
          gorduras += (alimentoInfo.gorduras || 0) * fator;
        }
      });
    });

    setResumoNutricional({
      caloriasTotais: Math.round(calorias),
      proteinasTotais: Math.round(proteinas * 10) / 10,
      carboidratosTotais: Math.round(carboidratos * 10) / 10,
      gordurasTotais: Math.round(gorduras * 10) / 10,
    });

  }, [refeicoes, alimentosBanco]);

  useEffect(() => {
    const fetchData = async () => {
      // Buscar Alunos
      const alunosSnapshot = await getDocs(collection(db, "alunos"));

      const currentUserId = auth.currentUser?.uid; // Exemplo
        if (currentUserId) {
            await carregarRascunho(currentUserId);
        }

      const alunosList = alunosSnapshot.docs.map(doc => ({
        id: doc.id, // O ID do documento Firestore (string)
        ...doc.data(),
      })) as Aluno[];
      setAlunosBanco(alunosList);

      // Buscar Alimentos (a lógica permanece a mesma)
      const alimentosSnapshot = await getDocs(collection(db, "alimentos"));
      const alimentosList = alimentosSnapshot.docs.map(doc => doc.data());
      setAlimentosBanco(alimentosList);
    };

    fetchData().catch(console.error);
  }, []);

  // Funções existentes (updateRefeicao, updateAlimento, etc.) mantidas iguais...
  const updateRefeicao = (index: number, field: keyof Refeicao, value: any) => {
    const novasRefeicoes = [...refeicoes];
    (novasRefeicoes[index] as any)[field] = value;
    setRefeicoes(novasRefeicoes);
  };

  const updateAlimento = (
    refeicaoIndex: number,
    alimentoIndex: number,
    field: keyof FoodItem,
    value: any
  ) => {
    const novasRefeicoes = [...refeicoes];
    (novasRefeicoes[refeicaoIndex].alimentos[alimentoIndex] as any)[field] = value;
    setRefeicoes(novasRefeicoes);
  };

  const addRefeicao = () => {
    setRefeicoes([
      ...refeicoes,
      { nome: '', horario: '', alimentos: [{ alimento: '', quantidade: 0, unidade: '' }] },
    ]);
  };

  const removeRefeicao = (index: number) => {
    setRefeicoes(refeicoes.filter((_, i) => i !== index));
  };

  const addAlimento = (refeicaoIndex: number) => {
    const novasRefeicoes = [...refeicoes];
    novasRefeicoes[refeicaoIndex].alimentos.push({ alimento: '', quantidade: 0, unidade: '' });
    setRefeicoes(novasRefeicoes);
  };

  const removeAlimento = (refeicaoIndex: number, alimentoIndex: number) => {
    const novasRefeicoes = [...refeicoes];
    novasRefeicoes[refeicaoIndex].alimentos = novasRefeicoes[refeicaoIndex].alimentos.filter(
      (_, i) => i !== alimentoIndex
    );
    setRefeicoes(novasRefeicoes);
  };

  const buscarAlimentos = (query: string) => {
    if (!query) return alimentosBanco.map(a => a.nome);
    return alimentosBanco
      .filter(a => a.nome.toLowerCase().includes(query.toLowerCase()))
      .map(a => a.nome);
  };

  const buscarAlunos = (query: string) => {
    if (!query) return alunosBanco;
    return alunosBanco.filter(a =>
      a.nome.toLowerCase().includes(query.toLowerCase()) ||
      a.email.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Funções dos botões de ação
  const handleSalvarDieta = async (event: React.FormEvent) => {
    event.preventDefault();

    const userId = auth.currentUser?.uid;
    if (!userId) {
        alert("Você precisa estar logado para salvar uma dieta.");
        return;
    }


    if (!aluno || !nomeDieta || !profissionalResponsavel) {
      alert('Por favor, preencha os campos obrigatórios: Aluno, Nome da Dieta e Profissional Responsável.');
      return;
    }

    // Criamos o objeto que será enviado ao Firestore
    const dadosDaDieta: DietaFirestore = {
      alunoId: aluno.id, // Armazenamos a referência (ID string)
      alunoNome: aluno.nome,
      nomeDieta,
      profissionalResponsavel,
      dataInicio,
      dataFim,
      objetivo,
      comorbidades,
      refeicoes,
      observacoesAdicionais,
      resumoNutricional,
      status: 'ativo',
      userId: 'user-id-placeholder', // Substitua pelo ID do usuário autenticado 
      criadoEm: new Date(),
    };

   try {
        if (rascunhoId) {
            // Se viemos de um rascunho, atualizamos o documento existente
            const dietaRef = doc(db, "dietas", rascunhoId);
            await updateDoc(dietaRef, dadosDaDieta);
            alert('Dieta publicada com sucesso!');
        } else {
            // Se não, criamos um documento novo
            await addDoc(collection(db, "dietas"), {
                ...dadosDaDieta,
                criadoEm: new Date(),
            });
            alert('Dieta salva com sucesso!');
        }
        setRascunhoId(null); // Limpa o ID do rascunho
       
    } catch (error) {
       
    }
  };

  const carregarRascunho = async (userId: string) => {
    if (!userId) return; // Não faz nada se não houver usuário

  // Criamos uma consulta para buscar na coleção 'dietas'
  const q = query(
    collection(db, "dietas"),
    where("userId", "==", userId),      // Onde o userId corresponde ao do usuário logado
    where("status", "==", "rascunho"),  // E o status é 'rascunho'
    limit(1)                            // Queremos apenas um rascunho por vez
  );

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const rascunhoDoc = querySnapshot.docs[0];
      const dadosDoRascunho = rascunhoDoc.data() as DietaFirestore;

      console.log("Rascunho do Firebase encontrado! Carregando...");

      // Preenchemos o formulário
      // ATENÇÃO: A lógica para 'setAluno' precisa ser ajustada
      // Precisamos encontrar o objeto Aluno completo a partir do alunoId salvo
      const alunoCompleto = alunosBanco.find(a => a.id === dadosDoRascunho.alunoId);
      setAluno(alunoCompleto || null);

      setNomeDieta(dadosDoRascunho.nomeDieta || '');
      setProfissionalResponsavel(dadosDoRascunho.profissionalResponsavel || '');
      // ... preencha os outros estados ...
      setRefeicoes(dadosDoRascunho.refeicoes || []);
      
      // MUITO IMPORTANTE: Guardamos o ID do rascunho para poder atualizá-lo depois
      setRascunhoId(rascunhoDoc.id);

      alert('Um rascunho salvo do Firebase foi carregado.');
    }
  } catch (error) {
    console.error("Erro ao carregar rascunho do Firebase:", error);
  }
  };

  const handleSalvarRascunho = async () => {
   const user =  auth.currentUser;
    if (!user) {
        alert("Você precisa estar logado para salvar um rascunho.");
        return;
    }
    const dadosRascunho: Omit<DietaFirestore, 'criadoEm'> = {
      alunoId: aluno?.id || '',
      alunoNome: aluno?.nome || '',
      nomeDieta,
      profissionalResponsavel,
      dataInicio,
      dataFim,
      objetivo,
      comorbidades,
      refeicoes,
      observacoesAdicionais,
      resumoNutricional,
      status: 'rascunho' as const, // Definindo o status
      userId: user.uid,     // Associando ao usuário
    };

    try {
        if (rascunhoId) {
            // Se já estamos editando um rascunho, nós o ATUALIZAMOS
            const rascunhoRef = doc(db, "dietas", rascunhoId);
            await updateDoc(rascunhoRef, dadosRascunho);
            alert('Rascunho atualizado com sucesso!');
        } else {
            // Se for um rascunho novo, nós o CRIAMOS
            const docRef = await addDoc(collection(db, "dietas"), {
                ...dadosRascunho,
                criadoEm: new Date(),
            });
            setRascunhoId(docRef.id); // Guardamos o ID do novo rascunho
            alert('Rascunho salvo com sucesso!');
        }
    } catch (error) {
        console.error('Erro ao salvar rascunho no Firebase:', error);
        alert('Ocorreu um erro ao salvar o rascunho.');
    }
  };



  const handlePrevisualizar = () => {
    if (!aluno || !nomeDieta) {
      alert('Por favor, preencha o nome do aluno e da dieta antes de pré-visualizar.');
      return;
    }
    const dadosBase: DietaPlan = {
      aluno,
      nomeDieta,
      profissionalResponsavel,
      dataInicio,
      dataFim,
      objetivo,
      comorbidades,
      refeicoes,
      observacoesAdicionais,
    };
    const dadosParaPreview: DietaComResumo = {
      ...dadosBase,
      resumoNutricional: resumoNutricional, // `resumoNutricional` vem do seu useMemo/useState
    };
    setPreviewData(dadosParaPreview);
    setIsPreviewOpen(true);
  }


  const handleCancelar = () => {
    const confirmacao = window.confirm(
      'Você tem certeza que deseja cancelar? As alterações não salvas serão perdidas.'
    );
    if (confirmacao) {
      router.back();
    }
  };


  return (
    <form className={styles.form}>
      <h1 className={styles.title}>Estrutura Completa de Dieta</h1>

      {/* Seção: Informações Gerais */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Informações Gerais</legend>

        <label className={styles.label}>
          Aluno:
          <input
            className={styles.input}
            type="text"
            value={aluno?.nome || ''}
            onChange={(e) => {
              const alunoEncontrado = alunosBanco.find(a => a.nome === e.target.value);
            setAluno(alunoEncontrado || null);
            }}
            list="alunos-sugestoes"
            placeholder="Digite o nome do aluno"
            required
          />
         <datalist id="alunos-sugestoes">
          {alunosBanco.map(alunoItem => (
            <option key={alunoItem.id} value={alunoItem.nome} />
          ))}
        </datalist>
        </label>

        <div className={styles.flexRow}>
          <label className={styles.label}>
            Nome da Dieta:
            <input
              className={styles.input}
              type="text"
              value={nomeDieta}
              onChange={(e) => setNomeDieta(e.target.value)}
              placeholder="Ex: Dieta para Hipertrofia"
              required
            />
          </label>

          <label className={styles.label}>
            Objetivo:
            <input
              className={styles.input}
              type="text"
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              placeholder="Ex: Ganho de massa muscular"
              required
            />
          </label>
        </div>

        <label className={styles.label}>
          Profissional Responsável:
          <input
            className={styles.input}
            type="text"
            value={profissionalResponsavel}
            onChange={(e) => setProfissionalResponsavel(e.target.value)}
            placeholder="Nome do nutricionista"
            required
          />
        </label>

        <div className={styles.flexRow}>
          <label className={styles.label}>
            Data de Início:
            <input
              className={styles.input}
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              required
            />
          </label>

          <label className={styles.label}>
            Data de Fim:
            <input
              className={styles.input}
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              required
            />
          </label>
        </div>

        <label className={styles.label}>
          Comorbidades:
          <textarea
            className={styles.input}
            value={comorbidades}
            onChange={(e) => setComorbidades(e.target.value)}
            placeholder="Diabetes, hipertensão, alergias, etc."
            rows={3}
          />
        </label>
      </fieldset>

      {/* Seção: Estrutura de Refeições (código existente mantido) */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Estrutura de Refeições</legend>

        {refeicoes.map((refeicao, rIndex) => (
          <fieldset key={rIndex} className={styles.innerFieldset}>
            <legend className={styles.innerLegend}>Refeição {rIndex + 1}</legend>

            <div className={styles.flexRow}>
              <label className={styles.label}>
                Nome da Refeição:
                <input
                  className={styles.input}
                  type="text"
                  value={refeicao.nome}
                  onChange={e => updateRefeicao(rIndex, 'nome', e.target.value)}
                  placeholder="Ex: Café da Manhã"
                  required
                />
              </label>

              <label className={styles.label}>
                Horário Sugerido:
                <input
                  className={styles.input}
                  type="time"
                  value={refeicao.horario}
                  onChange={e => updateRefeicao(rIndex, 'horario', e.target.value)}
                  required
                />
              </label>
            </div>

            <div>
              <h4>Alimentos</h4>
              {refeicao.alimentos.map((alimento, aIndex) => (
                <div key={aIndex} className={styles.alimentoItem}>
                  <label className={styles.label}>
                    Alimento:
                    <input
                      className={styles.input}
                      type="text"
                      value={alimento.alimento}
                      onChange={e => updateAlimento(rIndex, aIndex, 'alimento', e.target.value)}
                      list={`alimentos-sugestoes-${rIndex}-${aIndex}`}
                      placeholder="Digite para buscar"
                      required
                    />
                    <datalist id={`alimentos-sugestoes-${rIndex}-${aIndex}`}>
                      <option value="" />
                      {buscarAlimentos(alimento.alimento).map((item, idx) => (
                        <option key={idx} value={item} />
                      ))}
                    </datalist>
                  </label>

                  <div className={styles.flexRow}>
                    <label className={styles.label}>
                      Quantidade:
                      <input
                        className={styles.input}
                        type="number"
                        min={0}
                        value={alimento.quantidade}
                        onChange={e => updateAlimento(rIndex, aIndex, 'quantidade', Number(e.target.value))}
                        required
                      />
                    </label>

                    <label className={styles.label}>
                      Unidade:
                      <select
                        className={styles.input}
                        value={alimento.unidade}
                        onChange={e => updateAlimento(rIndex, aIndex, 'unidade', e.target.value)}
                        required
                      >
                        <option value="">Selecione</option>
                        {unidadesMedida.map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </label>

                    <button
                      className={styles.removeButton}
                      type="button"
                      onClick={() => removeAlimento(rIndex, aIndex)}
                      disabled={refeicao.alimentos.length === 1}
                    >
                      Remover
                    </button>
                  </div>

                  <label className={styles.label}>
                    Observações / Modo de Preparo:
                    <textarea
                      className={styles.input}
                      value={alimento.observacoes || ''}
                      onChange={e => updateAlimento(rIndex, aIndex, 'observacoes', e.target.value)}
                      rows={2}
                      placeholder="Ex: Grelhado, sem óleo, tempero natural"
                    />
                  </label>
                </div>
              ))}

              <button
                className={`${styles.button} ${styles.addButton}`}
                type="button"
                onClick={() => addAlimento(rIndex)}
              >
                Adicionar Alimento
              </button>
            </div>

            <button
              className={styles.removeButton}
              type="button"
              onClick={() => removeRefeicao(rIndex)}
              disabled={refeicoes.length === 1}
            >
              Remover Refeição
            </button>
          </fieldset>
        ))}

        <button
          className={`${styles.button} ${styles.addButton}`}
          type="button"
          onClick={addRefeicao}
        >
          Adicionar Refeição
        </button>
      </fieldset>

      {/* Seção: Resumo Nutricional */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Resumo Nutricional (Calculado Automaticamente)</legend>

        <div className={styles.resumoGrid}>
          <div className={styles.resumoItem}>
            <span className={styles.resumoLabel}>Calorias Totais:</span>
            <span className={styles.resumoValor}>{resumoNutricional.caloriasTotais} kcal</span>
          </div>
          <div className={styles.resumoItem}>
            <span className={styles.resumoLabel}>Proteínas Totais:</span>
            <span className={styles.resumoValor}>{resumoNutricional.proteinasTotais} g</span>
          </div>
          <div className={styles.resumoItem}>
            <span className={styles.resumoLabel}>Carboidratos Totais:</span>
            <span className={styles.resumoValor}>{resumoNutricional.carboidratosTotais} g</span>
          </div>
          <div className={styles.resumoItem}>
            <span className={styles.resumoLabel}>Gorduras Totais:</span>
            <span className={styles.resumoValor}>{resumoNutricional.gordurasTotais} g</span>
          </div>
        </div>
      </fieldset>

      {/* Seção: Observações Adicionais */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Observações Adicionais</legend>

        <label className={styles.label}>
          Observações da Dieta:
          <textarea
            className={styles.input}
            value={observacoesAdicionais}
            onChange={(e) => setObservacoesAdicionais(e.target.value)}
            rows={4}
            placeholder="Recomendações gerais, alertas, sugestões de suplementação, etc."
          />
        </label>
      </fieldset>

      {/* Botões de Ação */}
      <div className={styles.actionButtons}>
        <button className={styles.button} type="submit" onClick={handleSalvarDieta}>
          Salvar Dieta
        </button>
        <button className={`${styles.button} ${styles.draftButton}`} type="button" onClick={handleSalvarRascunho}>
          Salvar como Rascunho
        </button>
        <button className={`${styles.button} ${styles.previewButton}`} type="button" onClick={handlePrevisualizar}>
          Pré-visualizar Dieta
        </button>
        {/* O Modal para a pré-visualização */}
        <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} titleId='preview-title'>
          {/* Garantimos que só renderizamos o preview se houver dados */}
          {previewData && (
            <>
            <h1 id="preview-title" className={styles.srOnly}>Pré-visualização da Dieta</h1>
              <DietaPreview dietaData={previewData} />
            </>
          )}
        </Modal>
        <button className={styles.cancelButton} type="button" onClick={handleCancelar}>
          Cancelar
        </button>
      </div>


    </form>
  );
};