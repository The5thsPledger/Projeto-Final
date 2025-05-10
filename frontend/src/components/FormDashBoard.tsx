'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import styles from '@/styles/Dashboard.module.css';

interface DashboardData {
  marca: string;
  quantidade: number;
  total: number;
}

export default function FormDashBoard() {
  const [resumo, setResumo] = useState<DashboardData[]>([]);

  useEffect(() => {
    async function fetchResumo() {
      const res = await fetch('http://localhost:3000/api/veiculos/dashboard');
      const data = await res.json();
      setResumo(data);
    }

    fetchResumo();
  }, []);

  const formatarValor = (valor: number) =>
    Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <Layout titulo="Dashboard de Veículos">
      <div className={styles.grid}>
        {resumo.map((item, index) => (
          <div className={styles.card} key={index}>
            <div className={styles.tituloMarca}>{item.marca}</div>
            <div>{item.quantidade} veículo{item.quantidade > 1 ? 's' : ''}</div>
            <div>{formatarValor(item.total)}</div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
