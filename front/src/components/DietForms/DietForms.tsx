import React, { useState, useEffect } from 'react';
import styles from './DietForms.module.css';
import {
  DietaPlan,
  FoodItem,
  Refeicao,
  Aluno,
  ResumoNutricional,
} from "../../types/diet";

const unidadesMedida = ['g', 'ml', 'unidade', 'fatia', 'colher', 'xícara'];

// Mock de dados para busca
const alunosMock: Aluno[] = [
  { id: 1, nome: 'João Silva', email: 'joao@email.com' },
  { id: 2, nome: 'Maria Santos', email: 'maria@email.com' },
  { id: 3, nome: 'Pedro Costa', email: 'pedro@email.com' },
];

const alimentosBanco = [
  { nome: 'Arroz', calorias: 130, proteinas: 2.7, carboidratos: 28, gorduras: 0.3 },
  { nome: 'Feijão', calorias: 76, proteinas: 4.5, carboidratos: 14, gorduras: 0.5 },
  { nome: 'Frango', calorias: 165, proteinas: 31, carboidratos: 0, gorduras: 3.6 },
  { nome: 'Ovo', calorias: 155, proteinas: 13, carboidratos: 1.1, gorduras: 11 },
];

export const EstruturaRefeicoesForm: React.FC = () => {
  // Estados principais
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [nomeDieta, setNomeDieta] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [profissionalResponsavel, setProfissionalResponsavel] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [comorbidades, setComorbidades] = useState('');
  const [observacoesAdicionais, setObservacoesAdicionais] = useState('');

  const resetForm = () => {
  console.log('Resetando o formulário para o estado inicial...');
  // Reseta todos os estados para seus valores iniciais
  setAluno(null);
  setNomeDieta('');
  setObjetivo('');
  setProfissionalResponsavel('');
  setDataInicio('');
  setDataFim('');
  setComorbidades('');
  setObservacoesAdicionais('');

  // Reseta a estrutura de refeições para o padrão inicial
  setRefeicoes([
    { nome: '', horario: '', alimentos: [{ alimento: '', quantidade: 0, unidade: '' }] }
  ]);
  
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
          calorias += alimentoInfo.calorias * fator;
          proteinas += alimentoInfo.proteinas * fator;
          carboidratos += alimentoInfo.carboidratos * fator;
          gorduras += alimentoInfo.gorduras * fator;
        }
      });
    });

    setResumoNutricional({
      caloriasTotais: Math.round(calorias),
      proteinasTotais: Math.round(proteinas * 10) / 10,
      carboidratosTotais: Math.round(carboidratos * 10) / 10,
      gordurasTotais: Math.round(gorduras * 10) / 10,
    });
    
  }, [refeicoes]);

  useEffect(() => {
    // Carregar rascunho salvo ao montar o componente
    carregarRascunho();
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
    if (!query) return alunosMock;
    return alunosMock.filter(a =>
      a.nome.toLowerCase().includes(query.toLowerCase()) ||
      a.email.toLowerCase().includes(query.toLowerCase())
    );
  };

  const salvarComoJson = async (dados: any, nomeArquivo: string) => {
    const jsonString = JSON.stringify(dados, null, 2);

    const blob = new Blob([jsonString], { type: 'application/json' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo || 'dados.json';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

  };

  // Funções dos botões de ação
  const handleSalvarDieta = async () => {

    const dadosAtuaisDaDieta = {
      aluno,
      nomeDieta,
      profissionalResponsavel,
      dataInicio,
      dataFim,
      objetivo,
      comorbidades,
      refeicoes, // 'refeicoes' vem do estado e está atualizado.
      observacoesAdicionais,
    };
    setDietaPlan([dadosAtuaisDaDieta]); // Atualiza o estado com os dados atuais
    const nomeDoArquivo = `dieta_${dadosAtuaisDaDieta.aluno?.nome || 'aluno'}_${dadosAtuaisDaDieta.nomeDieta || 'plano'}.json`;
    try {
      await salvarComoJson([dadosAtuaisDaDieta], nomeDoArquivo);
      alert('Seu plano de dieta foi salvo com sucesso!');
      localStorage.removeItem('rascunhoDieta');
    } catch (error) {
      console.error('Erro ao salvar o plano de dieta:', error);
      alert('Ocorreu um erro ao salvar o plano de dieta. Por favor, tente novamente.');
    }
  };

  const carregarRascunho = () => {
    try {
        const rascunhoSalvo = localStorage.getItem('rascunhoDieta');

        if (rascunhoSalvo) {
            console.log("Rascunho encontrado! Carregando...");
            const dadosDoRascunho = JSON.parse(rascunhoSalvo);

            // Atualiza todos os estados do formulário com os dados do rascunho
            setAluno(dadosDoRascunho.aluno || null);
            setNomeDieta(dadosDoRascunho.nomeDieta || '');
            setProfissionalResponsavel(dadosDoRascunho.profissionalResponsavel || '');
            setDataInicio(dadosDoRascunho.dataInicio || '');
            setDataFim(dadosDoRascunho.dataFim || '');
            setObjetivo(dadosDoRascunho.objetivo || '');
            setComorbidades(dadosDoRascunho.comorbidades || '');
            setRefeicoes(dadosDoRascunho.refeicoes || [{ nome: '', horario: '', alimentos: [] }]);
            setObservacoesAdicionais(dadosDoRascunho.observacoesAdicionais || '');

            alert('Um rascunho salvo foi carregado.');
        }
    } catch (error) {
        console.error("Erro ao carregar ou processar o rascunho:", error);
        // Opcional: remover o rascunho corrompido
        localStorage.removeItem('rascunhoDieta');
    }
};

  const handleSalvarRascunho = () => {
    const dadosRascunho = {
      aluno,
      nomeDieta,
      profissionalResponsavel,
      dataInicio,
      dataFim,
      objetivo,
      comorbidades,
      refeicoes,
      observacoesAdicionais,
      isRascunho: true,
    };
    try {
      const dadosEmJson = JSON.stringify(dadosRascunho);
      localStorage.setItem('rascunhoDieta', dadosEmJson);
      alert('Rascunho salvo com sucesso! Você pode continuar de onde parou mais tarde.');
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
      alert('Ocorreu um erro ao salvar o rascunho. Por favor, tente novamente.');
    }
  };



  const handlePrevisualizar = () => {
    console.log('Pré-visualizando...');
  };

  const handleCancelar = () => {
    const confirmacao = window.confirm('Você tem certeza que deseja cancelar? Todas as alterações não salvas, incluindo o rascunho, serão perdidas.')
    if (confirmacao) {
      resetForm();
      localStorage.removeItem('rascunhoDieta'); // Limpa o rascunho salvo
      alert('O formulário foi limpo.');
    }
    else{
      alert('Operação cancelada. Você pode continuar editando o formulário.');
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
              const alunoEncontrado = alunosMock.find(a => a.nome === e.target.value);
              setAluno(alunoEncontrado || null);
            }}
            list="alunos-sugestoes"
            placeholder="Digite o nome do aluno"
            required
          />
          <datalist id="alunos-sugestoes">
            {buscarAlunos(aluno?.nome || '').map(aluno => (
              <option key={aluno.id} value={aluno.nome} />
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
          Pré-visualizar / Imprimir
        </button>
        <button className={styles.cancelButton} type="button" onClick={handleCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
};
