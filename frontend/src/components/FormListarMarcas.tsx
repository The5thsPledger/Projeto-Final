'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import styles from '@/styles/FormListarMarcas.module.css';
import { useRouter } from 'next/navigation';

interface Marca {
  id: string;
  nome: string;
}

export default function FormListarMarcas() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
  
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
        .catch((error) => {
          console.error('Erro ao carregar marcas:', error);
        });
    }
  }, []);

  const excluirMarca = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta marca?')) return;
  
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/marcas/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.ok) {
        alert('Marca excluída com sucesso!');
        setMarcas((prev) => prev.filter((m) => m.id !== id));
      } else {
        const erro = await res.json();
        alert(erro.mensagem || 'Erro ao excluir marca.');
      }
    } catch (error) {
      console.error('Erro ao excluir marca:', error);
      alert('Erro inesperado ao excluir.');
    }
  };

  return (
    <Layout titulo="Listagem de Marcas">
      <div className={styles.container}>
        <h2 className={styles.titulo}>Marcas Cadastradas</h2>
        {marcas.length === 0 ? (
          <p>Nenhuma marca encontrada.</p>
        ) : (
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {marcas.map((marca) => (
                <tr key={marca.id}>
                  <td>{marca.nome}</td>
                  <td>
                    <button
                      className={styles.botaoAlterar}
                      onClick={() => router.push(`/marcas/editar/${marca.id}`)}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.botaoExcluir}
                      onClick={() => excluirMarca(marca.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className={styles.botoesGrupo}>
          <button
            className={styles.botaoIncluir}
            onClick={() => router.push('/marcas/cadastrar')}
          >
            Incluir
          </button>
        </div>
      </div>
    </Layout>
  );
}