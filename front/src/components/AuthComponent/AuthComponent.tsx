"use client";

import React, { useState } from 'react';
import { AddMeal } from '../AddMeal/AddMeal';
import { useRouter } from 'next/router';
import styles from './AuthForm.module.css';
import { auth } from '../../lib/firebase'; // Importando auth do Firebase

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile, // Para salvar o nome do usuário no cadastro
  sendPasswordResetEmail // Para implementar a funcionalidade de recuperação de senha
} from "firebase/auth";


type AuthMode = 'signin' | 'signup';



export const AuthComponent: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const router = useRouter();

  // Estados para os campos do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handlePasswordReset = async () => {
    if (!email) {
        setError("Por favor, digite seu e-mail para recuperar a senha.");
        return;
    }
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Um e-mail de recuperação de senha foi enviado para " + email);
        setError(null);
    } catch (err: any) {
        setError("Não foi possível enviar o e-mail de recuperação.");
        console.error(err);
    }
};

  const handleSignInMode = () => setAuthMode('signin');
  const handleSignUpMode = () => setAuthMode('signup');


  const handleSignIn = () => {
    setAuthMode('signin');
  };

  const handleSignUp = () => {
    setAuthMode('signup');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (authMode === 'signup') {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { displayName: name });
        }
        alert(`Cadastro realizado com sucesso.`);
        router.push('/');
      } catch (err: any) {
        console.error("Erro no cadastro:", err.code);
        if (err.code === 'auth/email-already-in-use') {
          setError('Este email já está em uso.');
        }
        else if (err.code === 'auth/invalid-email') {
          setError('O email fornecido é inválido.');
        }
        else if (err.code === 'auth/weak-password') {
          setError('A senha deve ter pelo menos 6 caracteres.');
        }
        else {
          setError('Ocorreu um erro ao criar a conta.');
        }
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        router.push('/calendar'); // Redireciona para a página de calendário após o login
      } catch (err: any) {
        console.error("Erro no login:", err.code);
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          setError('Email ou senha inválidas.');
        }
        else {
          setError('Ocorreu um erro ao tentar fazer login.');
        }
      }
    }
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
              onClick={handleSignInMode}
            >
              Entrar
            </button>
          </div>

          <div className={styles.secondColumn}>
            <h2 className={`${styles.title} ${styles.titleSecond}`}>
              Criar Conta
            </h2>
            <p className={`${styles.description} ${styles.descriptionSecond}`}>
              Use seu email para registrar-se
            </p>
            <form className={styles.form} onSubmit={handleFormSubmit}>
              {authMode === 'signup' && (
              <label className={styles.labelInput}>
                <input
                  type="text"
                  placeholder="Nome"
                  className={styles.input}
                  required value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              )}

              <label className={styles.labelInput}>
                <input
                  type="email"
                  placeholder="Email"
                  className={styles.input}
                  required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className={styles.labelInput}>
                <input
                  type="password"
                  placeholder="Senha"
                  className={styles.input}
                  required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <button className={`${styles.btn} ${styles.btnSecond}`} type="submit">
                Cadastrar
              </button>
              {authMode === 'signup' && error && <p className={styles.error}>{error}</p>}
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
            <form className={styles.form} onSubmit={handleFormSubmit}>
              <label className={styles.labelInput}>
                <input
                  type="email"
                  placeholder="Email"
                  className={styles.input}
                  required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className={styles.labelInput}>
                <input
                  type="password"
                  placeholder="Senha"
                  className={styles.input}
                  required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              {authMode === 'signin' && (
              <a href="#" onClick={handlePasswordReset} className={styles.password}>
                esqueceu sua senha?
              </a>
              )}
              <button className={`${styles.btn} ${styles.btnSecond}`} type="submit">
                Entrar
              </button>
              {authMode === 'signin' && error && <p className={styles.error}>{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
