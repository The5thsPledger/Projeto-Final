'use client';

import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import styles from '@/styles/FormCadastrarUsuario.module.css';
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface FormData {
    nome: string;
    email: string;
    senha?: string; // opcional aqui
  }
  
  const schema = yup.object({
    nome: yup.string().required('O nome é obrigatório'),
    email: yup.string().email('Email inválido').required('O email é obrigatório'),
    senha: yup.string().min(6, 'A senha deve ter pelo menos 6 caracteres').notRequired(),
  }) as yup.ObjectSchema<FormData>;

export default function FormCadastrarUsuario() {
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

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      router.push('/entrar');
      return;
    }

    async function fetchUsuario() {
      try {
        const res = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setValue('nome', data.usuario.nome);
          setValue('email', data.usuario.email);
        } else {
          alert('Erro ao buscar usuário');
          router.push('/usuarios/listar');
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        alert('Erro inesperado ao buscar usuário');
        router.push('/usuarios/listar');
      }
    }

    fetchUsuario();
  }, [id, router, setValue]);

  const onSubmit = async (data: FormData) => {
    const method = id ? 'PUT' : 'POST';
    const url = id
      ? `http://localhost:3000/api/usuarios/${id}`
      : 'http://localhost:3000/api/usuarios';

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      router.push('/entrar');
      return;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert(`Usuário ${id ? 'atualizado' : 'cadastrado'} com sucesso!`);
        router.push('/usuarios/listar');
      } else {
        const erro = await res.json();
        const detalhe = erro.detalhe || erro.mensagem || 'Erro ao salvar usuário';
        alert(detalhe);
      }
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      alert('Erro inesperado.');
    }
  };

  return (
    <Layout titulo={id ? 'Editar Usuário' : 'Cadastrar Usuário'}>
      <div className={styles.container}>
        <h2 className={styles.titulo}>
          {id ? 'Edição de Usuário' : 'Cadastro de Usuário'}
        </h2>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.grupo}>
            <label>Nome:</label>
            <input type="text" {...register('nome')} />
            {errors.nome && <span className={styles.erro}>{errors.nome.message}</span>}
          </div>

          <div className={styles.grupo}>
            <label>Email:</label>
            <input type="email" {...register('email')} />
            {errors.email && <span className={styles.erro}>{errors.email.message}</span>}
          </div>

          {!id && (
            <div className={styles.grupo}>
              <label>Senha:</label>
              <input type="password" {...register('senha')} />
              {errors.senha && <span className={styles.erro}>{errors.senha.message}</span>}
            </div>
          )}

          <div className={styles.botoes}>
            <button type="submit" className={styles.botaoCadastrar}>
              {id ? 'Atualizar' : 'Cadastrar'}
            </button>
            <button
              type="button"
              className={styles.botaoCancelar}
              onClick={() => router.push('/usuarios/listar')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
// este aqui funciona tudo xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx