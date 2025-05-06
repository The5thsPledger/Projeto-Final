'use client';

import styles from './FormVeiculo.module.css';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  marca: z.string().min(1, 'Selecione uma marca'),
  modelo: z.string().min(1, 'Modelo é obrigatório'),
  ano: z.number({ invalid_type_error: 'Ano deve ser um número' }).min(1900).max(new Date().getFullYear()),
  valor: z.number({ invalid_type_error: 'Valor deve ser um número' }).positive('Valor deve ser maior que zero')
});

type FormData = z.infer<typeof schema>;

export default function FormVeiculo() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/veiculos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        alert('Veículo cadastrado com sucesso!');
        reset();
      } else {
        alert('Erro ao cadastrar veículo.');
      }
    } catch (error) {
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="marca">Marca:</label>
        <select id="marca" {...register('marca')}>
          <option value="">Selecione</option>
          <option value="FORD">FORD</option>
          <option value="GM">GM</option>
        </select>
        {errors.marca && <span className={styles.error}>{errors.marca.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="modelo">Modelo:</label>
        <input id="modelo" type="text" {...register('modelo')} />
        {errors.modelo && <span className={styles.error}>{errors.modelo.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="ano">Ano:</label>
        <input id="ano" type="number" {...register('ano', { valueAsNumber: true })} />
        {errors.ano && <span className={styles.error}>{errors.ano.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="valor">Valor:</label>
        <input id="valor" type="number" step="0.01" {...register('valor', { valueAsNumber: true })} />
        {errors.valor && <span className={styles.error}>{errors.valor.message}</span>}
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit">Cadastrar</button>
        <button type="button" onClick={() => reset()}>Cancelar</button>
      </div>
    </form>
  );
}