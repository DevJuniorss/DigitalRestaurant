import React, { useState } from 'react';
import styles from './AuthForm.module.css';

type AuthMode = 'signin' | 'signup';

export const AuthComponent: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('signup');

  const handleSignIn = () => {
    setAuthMode('signin');
  };

  const handleSignUp = () => {
    setAuthMode('signup');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de autenticação aqui
    console.log('Form submitted');
  };

  return (
    <div className={`${styles.container} ${authMode === 'signin' ? styles.signInJs : styles.signUpJs}`}>
      <div className={styles.content}>
        {/* Primeiro Conteúdo - Cadastro */}
        <div className={styles.firstContent}>
          <div className={styles.firstColumn}>
            <h2 className={`${styles.title} ${styles.titlePrimary}`}>
              Bem vindo de volta!
            </h2>
            <p className={`${styles.description} ${styles.descriptionPrimary}`}>
              Para continuar conectado
            </p>
            <p className={`${styles.description} ${styles.descriptionPrimary}`}>
              por favor insira seus dados
            </p>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={handleSignIn}
            >
              Entrar
            </button>
          </div>

          <div className={styles.secondColumn}>
            <h2 className={`${styles.title} ${styles.titleSecond}`}>
              Criar Conta
            </h2>
            <div className={styles.socialMedia}>
              <ul className={styles.listSocialMedia}>
                <li className={styles.itemSocialMedia}>f</li>
                <li className={styles.itemSocialMedia}>g</li>
                <li className={styles.itemSocialMedia}>l</li>
              </ul>
            </div>
            <p className={`${styles.description} ${styles.descriptionSecond}`}>
              ou use seu email para registrar-se
            </p>
            <form className={styles.form} onSubmit={handleFormSubmit}>
              <label className={styles.labelInput}>
                <input
                  type="text"
                  placeholder="Nome"
                  className={styles.input}
                  required
                />
              </label>
              <label className={styles.labelInput}>
                <input
                  type="email"
                  placeholder="Email"
                  className={styles.input}
                  required
                />
              </label>
              <label className={styles.labelInput}>
                <input
                  type="password"
                  placeholder="Senha"
                  className={styles.input}
                  required
                />
              </label>
              <button className={`${styles.btn} ${styles.btnSecond}`} type="submit">
                Cadastrar
              </button>
            </form>
          </div>
        </div>

        {/* Segundo Conteúdo - Login */}
        <div className={styles.secondContent}>
          <div className={styles.firstColumn}>
            <h2 className={`${styles.title} ${styles.titlePrimary}`}>
              Olá, Amigo!
            </h2>
            <p className={`${styles.description} ${styles.descriptionPrimary}`}>
              Insira seus dados
            </p>
            <p className={`${styles.description} ${styles.descriptionPrimary}`}>
              e comece essa jornada com a gente
            </p>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={handleSignUp}
            >
              Cadastrar
            </button>
          </div>

          <div className={styles.secondColumn}>
            <h2 className={`${styles.title} ${styles.titleSecond}`}>
              Entrar
            </h2>
            <div className={styles.socialMedia}>
              <ul className={styles.listSocialMedia}>
                <li className={styles.itemSocialMedia}>f</li>
                <li className={styles.itemSocialMedia}>g</li>
                <li className={styles.itemSocialMedia}>l</li>
              </ul>
            </div>
            <p className={`${styles.description} ${styles.descriptionSecond}`}>
              ou use sua conta de email
            </p>
            <form className={styles.form} onSubmit={handleFormSubmit}>
              <label className={styles.labelInput}>
                <input
                  type="email"
                  placeholder="Email"
                  className={styles.input}
                  required
                />
              </label>
              <label className={styles.labelInput}>
                <input
                  type="password"
                  placeholder="Senha"
                  className={styles.input}
                  required
                />
              </label>
              <a href="#" className={styles.password}>
                esqueceu sua senha?
              </a>
              <button className={`${styles.btn} ${styles.btnSecond}`} type="submit">
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
