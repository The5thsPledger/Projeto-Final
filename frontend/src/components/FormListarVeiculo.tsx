"use client";

import React, { useEffect, useState } from 'react';
import styles from './FormListarVeiculo.module.css';

interface Veiculo {
  id: number;
  marca: string;
  modelo: string;
  ano: string;
  valor: string;
}

export default function FormListarVeiculo() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

  useEffect(() => {
    fetch('/api/veiculos')
      .then(res => res.json())
      .then(data => setVeiculos(data));
  }, []);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>Carango Bom - Listagem de Veículos</h1>
      </header>

      <aside className={styles.sidebar}>
        <ul>
          <li><a href="#">Entrar</a></li>
          <li><a href="#">Veículos</a></li>
          <li><a href="#">Marcas</a></li>
          <li><a href="#">Usuários</a></li>
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Sair</a></li>
        </ul>
      </aside>

      <main className={styles.content}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Ano</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {veiculos.map((veiculo) => (
              <tr key={veiculo.id}>
                <td>{veiculo.marca}</td>
                <td>{veiculo.modelo}</td>
                <td>{veiculo.ano}</td>
                <td>{veiculo.valor}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.buttons}>
          <button className={styles.delete}>Excluir</button>
          <button className={styles.default}>Alterar</button>
          <button className={styles.default}>Incluir</button>
        </div>
      </main>
    </div>
  );
}
