import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Layout from './Layout';
import styles from '../styles/Login.module.css';

interface LoginFormData {
  usuario: string;
  senha: string;
}

const schema = yup.object().shape({
  usuario: yup.string().required('Usuário é obrigatório'),
  senha: yup.string().required('Senha é obrigatória').min(4, 'Mínimo de 4 caracteres'),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: yupResolver(schema) });

  const onSubmit = (data: LoginFormData) => {
    console.log('Login realizado com:', data);
  };

  return (
    <Layout titulo="Carango Bom - Login">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div>
          <label>Usuário:</label>
          <input {...register('usuario')} />
          {errors.usuario && <p className={styles.error}>{errors.usuario.message}</p>}
        </div>
        <div>
          <label>Senha:</label>
          <input type="password" {...register('senha')} />
          {errors.senha && <p className={styles.error}>{errors.senha.message}</p>}
        </div>
        <button type="submit">Logar</button>
      </form>
    </Layout>
  );
}