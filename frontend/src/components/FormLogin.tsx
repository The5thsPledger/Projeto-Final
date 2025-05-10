'use client';

import React from 'react';
import styles from '@/styles/FormLogin.module.css';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface LoginForm {
  email: string;
  senha: string;
}

const schema = yup.object().shape({
  email: yup.string().email('Email inválido').required('O email é obrigatório'),
  senha: yup.string().required('A senha é obrigatória'),
});

export default function FormLogin() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
        const res = await fetch('http://localhost:3000/api/autenticacao/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

      const result = await res.json();

      if (res.ok && result.access_token) {  
        localStorage.setItem('token', result.access_token);
        router.push('/veiculos/dashboard');
      } else {
        alert(result.mensagem || 'Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao tentar fazer login.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Entrar no sistema</h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.grupo}>
          <label>Email:</label>
          <input type="email" {...register('email')} />
          {errors.email && <span className={styles.erro}>{errors.email.message}</span>}
        </div>

        <div className={styles.grupo}>
          <label>Senha:</label>
          <input type="password" {...register('senha')} />
          {errors.senha && <span className={styles.erro}>{errors.senha.message}</span>}
        </div>

        <button type="submit" className={styles.botao}>
          Entrar
        </button>
      </form>
    </div>
  );
}
