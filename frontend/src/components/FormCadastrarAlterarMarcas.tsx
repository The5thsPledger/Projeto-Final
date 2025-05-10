'use client';

import React from 'react';
import Layout from '@/components/Layout';
import styles from '@/styles/FormCadastrarVeiculos.module.css';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface FormData {
  nome: string;
}

const schema = yup.object().shape({
  nome: yup.string().required('O nome da marca é obrigatório'),
});

export default function FormCadastrarAlterarMarcas() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      router.push('/entrar');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/marcas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert('Marca cadastrada com sucesso!');
        router.push('/marcas/listar');
      } else {
        const erro = await res.json();
        alert(erro.mensagem || 'Erro ao cadastrar marca');
      }
    } catch (error) {
      console.error('Erro ao cadastrar marca:', error);
      alert('Erro inesperado.');
    }
  };

  return (
    <Layout titulo="Cadastro de Marca">
      <div className={styles.container}>
        <h2 className={styles.titulo}>Cadastro de Marca</h2>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.grupo}>
            <label>Nome:</label>
            <input type="text" {...register('nome')} />
            {errors.nome && <span className={styles.erro}>{errors.nome.message}</span>}
          </div>

          <div className={styles.botoes}>
            <button type="submit" className={styles.botaoCadastrar}>
              Cadastrar
            </button>
            <button
              type="button"
              className={styles.botaoCancelar}
              onClick={() => router.push('/marcas/listar')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
