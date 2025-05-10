'use client';

import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import styles from '../styles/FormCadastrarVeiculos.module.css';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface Marca {
  id: string;
  nome: string;
}

const schema = yup.object().shape({
  modelo: yup.string().required('O modelo é obrigatório'),
  ano: yup
    .number()
    .typeError('O ano deve ser um número')
    .required('O ano é obrigatório')
    .positive('O ano deve ser positivo')
    .max(9999, 'Ano inválido'),
  valor: yup
    .number()
    .typeError('O valor deve ser numérico')
    .required('O valor é obrigatório')
    .positive('O valor deve ser positivo'),
  marcaId: yup.string().required('A marca é obrigatória'),
});

interface FormData {
  modelo: string;
  ano: number;
  valor: number;
  marcaId: string;
}

export default function FormCadastrarVeiculos() {
  const router = useRouter();
  const [marcas, setMarcas] = useState<Marca[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // Só executa no cliente
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      if (token) {
        fetch('http://localhost:3000/api/marcas', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setMarcas(Array.isArray(data) ? data : data.marcas || []);
          })
          .catch((err) => {
            console.error('Erro ao carregar marcas:', err);
          });
      }
    }
  }, []);

  const onSubmit = async (data: FormData) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:3000/api/veiculos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          modelo: data.modelo,
          ano: data.ano,
          valor: data.valor,
          marca: {
            id: data.marcaId,
          },
        }),
      });

      if (response.ok) {
        alert('Veículo cadastrado com sucesso!');
        router.push('/');
      } else {
        const erro = await response.json();
        alert(erro.mensagem || 'Erro ao cadastrar veículo.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar veículo:', error);
      alert('Erro inesperado.');
    }
  };

  return (
    <Layout titulo="Cadastro de Veículo">
      <div className={styles.container}>
        <h2 className={styles.titulo}>Registro de Veículos</h2>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.grupo}>
            <label>Marca:</label>
            <select {...register('marcaId')}>
              <option value="">Selecione uma marca</option>
              {marcas.map((m) => (
                <option key={m.id} value={String(m.id)}>
                  {m.nome}
                </option>
              ))}
            </select>
            {errors.marcaId && (
              <span className={styles.erro}>{errors.marcaId.message}</span>
            )}
          </div>

          <div className={styles.grupo}>
            <label>Modelo:</label>
            <input type="text" {...register('modelo')} />
            {errors.modelo && (
              <span className={styles.erro}>{errors.modelo.message}</span>
            )}
          </div>

          <div className={styles.grupo}>
            <label>Ano:</label>
            <input type="number" {...register('ano')} />
            {errors.ano && (
              <span className={styles.erro}>{errors.ano.message}</span>
            )}
          </div>

          <div className={styles.grupo}>
            <label>Valor:</label>
            <input type="number" step="0.01" {...register('valor')} />
            {errors.valor && (
              <span className={styles.erro}>{errors.valor.message}</span>
            )}
          </div>

          <div className={styles.botoes}>
            <button type="submit" className={styles.botaoCadastrar}>
              Cadastrar
            </button>
            <button
              type="button"
              className={styles.botaoCancelar}
              onClick={() => router.push('/')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
