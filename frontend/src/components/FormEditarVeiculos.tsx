'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import styles from '@/styles/FormCadastrarVeiculos.module.css';
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface Marca {
  id: string;
  nome: string;
}

interface FormData {
  modelo: string;
  ano: number;
  valor: number;
  marcaId: string;
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

export default function FormEditarVeiculos() {
  const router = useRouter();
  const params = useParams();
  const [marcas, setMarcas] = useState<Marca[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    async function fetchMarcas() {
      const res = await fetch('http://localhost:3000/api/marcas');
      const data = await res.json();
      setMarcas(data);
    }

    async function fetchVeiculo() {
      const res = await fetch(`http://localhost:3000/api/veiculos/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setValue('modelo', data.modelo);
        setValue('ano', data.ano);
        setValue('valor', data.valor);
        setValue('marcaId', data.marca.id);
      } else {
        alert('Erro ao buscar veículo');
        router.push('/');
      }
    }

    fetchMarcas();
    fetchVeiculo();
  }, [params.id, router, setValue]);

  const onSubmit = async (data: FormData) => {
    const { modelo, ano, valor, marcaId } = data;

    try {
      const res = await fetch(`http://localhost:3000/api/veiculos/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelo,
          ano,
          valor,
          marca: { id: marcaId },
        }),
      });

      if (res.ok) {
        alert('Veículo atualizado com sucesso!');
        router.push('/');
      } else {
        alert('Erro ao atualizar veículo');
      }
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      alert('Erro inesperado.');
    }
  };

  return (
    <Layout titulo="Editar Veículo">
      <div className={styles.container}>
        <h2 className={styles.titulo}>Edição de Veículos</h2>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.grupo}>
            <label>Marca:</label>
            <select {...register('marcaId')}>
              <option value="">Selecione uma marca</option>
              {marcas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome}
                </option>
              ))}
            </select>
            {errors.marcaId && <span className={styles.erro}>{errors.marcaId.message}</span>}
          </div>

          <div className={styles.grupo}>
            <label>Modelo:</label>
            <input type="text" {...register('modelo')} />
            {errors.modelo && <span className={styles.erro}>{errors.modelo.message}</span>}
          </div>

          <div className={styles.grupo}>
            <label>Ano:</label>
            <input type="number" {...register('ano')} />
            {errors.ano && <span className={styles.erro}>{errors.ano.message}</span>}
          </div>

          <div className={styles.grupo}>
            <label>Valor:</label>
            <input type="number" step="0.01" {...register('valor')} />
            {errors.valor && <span className={styles.erro}>{errors.valor.message}</span>}
          </div>

          <div className={styles.botoes}>
            <button type="submit" className={styles.botaoCadastrar}>
              Atualizar
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