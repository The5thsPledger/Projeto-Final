'use client';

import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import styles from '@/styles/FormCadastrarVeiculos.module.css';
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface FormData {
  nome: string;
}

const schema = yup.object().shape({
  nome: yup.string().required('O nome da marca é obrigatório'),
});

export default function FormEditarMarca() {
  const router = useRouter();
  const params = useParams();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!id) return;

    async function fetchMarca() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Sessão expirada. Faça login novamente.');
        router.push('/entrar');
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/api/marcas/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setValue('nome', data.marca.nome);
        } else {
          alert('Erro ao buscar marca');
          router.push('/marcas/listar');
        }
      } catch (error) {
        console.error('Erro ao buscar marca:', error);
        alert('Erro inesperado ao buscar marca');
        router.push('/marcas/listar');
      }
    }

    fetchMarca();
  }, [id, router, setValue]);

  const onSubmit = async (data: FormData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      router.push('/entrar');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/marcas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert('Marca atualizada com sucesso!');
        router.push('/marcas/listar');
      } else {
        const erro = await res.json();
        alert(erro.mensagem || 'Erro ao atualizar marca');
      }
    } catch (error) {
      console.error('Erro ao atualizar marca:', error);
      alert('Erro inesperado.');
    }
  };

  return (
    <Layout titulo="Editar Marca">
      <div className={styles.container}>
        <h2 className={styles.titulo}>Edição de Marca</h2>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.grupo}>
            <label>Nome:</label>
            <input type="text" {...register('nome')} />
            {errors.nome && <span className={styles.erro}>{errors.nome.message}</span>}
          </div>

          <div className={styles.botoes}>
            <button type="submit" className={styles.botaoCadastrar}>
              Atualizar
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
