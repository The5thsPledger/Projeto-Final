'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import styles from '@/styles/FormListarVeiculo.module.css';
import { useRouter } from 'next/navigation';

interface Veiculo {
  id: string;
  modelo: string;
  ano: number;
  valor: number;
  marca: {
    nome: string;
  };
}

interface Marca {
  id: string;
  nome: string;
}

export default function FormListarVeiculos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [logado, setLogado] = useState(false);

  const [filtroMarca, setFiltroMarca] = useState('');
  const [filtroAno, setFiltroAno] = useState('');
  const [valorMinimo, setValorMinimo] = useState('');
  const [valorMaximo, setValorMaximo] = useState('');

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLogado(!!token);
    carregarVeiculos();
    carregarMarcas();
  }, []);

  async function carregarVeiculos() {
    try {
      const res = await fetch('http://localhost:3000/api/veiculos');
      const data = await res.json();
      setVeiculos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
    }
  }

  async function carregarMarcas() {
    try {
      const res = await fetch('http://localhost:3000/api/marcas');
      const data = await res.json();
      setMarcas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar marcas:', error);
    }
  }

  const excluirVeiculo = async (id: string) => {
    if (!confirm('Deseja realmente excluir este veículo?')) return;

    try {
      const res = await fetch(`http://localhost:3000/api/veiculos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.ok) {
        alert('Veículo excluído com sucesso!');
        setVeiculos((prev) => prev.filter((v) => v.id !== id));
      } else {
        const erro = await res.json();
        alert(erro.mensagem || 'Erro ao excluir veículo.');
      }
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
      alert('Erro inesperado.');
    }
  };

  const limparFiltros = () => {
    setFiltroMarca('');
    setFiltroAno('');
    setValorMinimo('');
    setValorMaximo('');
  };

  const veiculosFiltrados = veiculos.filter((v) => {
    const marcaMatch = !filtroMarca || v.marca?.nome === filtroMarca;
    const anoMatch = !filtroAno || v.ano.toString().includes(filtroAno);
    const valorMin = valorMinimo ? parseFloat(valorMinimo) : 0;
    const valorMax = valorMaximo ? parseFloat(valorMaximo) : Infinity;
    const valorMatch = v.valor >= valorMin && v.valor <= valorMax;
    return marcaMatch && anoMatch && valorMatch;
  });

  return (
    <Layout titulo="Veículos Registrados">
      <div className={styles.container}>
        <h2 className={styles.titulo}>Veículos Registrados</h2>

        <div className={styles.filtrosLinha}>
          <div className={styles.filtroItem}>
            <label>Marca:</label>
            <select
              value={filtroMarca}
              onChange={(e) => setFiltroMarca(e.target.value)}
            >
              <option value="">Todos</option>
              {marcas.map((m) => (
                <option key={m.id} value={m.nome}>{m.nome}</option>
              ))}
            </select>
          </div>
          <div className={styles.filtroItem}>
            <label>Ano:</label>
            <input
              type="text"
              value={filtroAno}
              onChange={(e) => setFiltroAno(e.target.value)}
            />
          </div>
          <div className={styles.filtroItem}>
            <label>Valor mínimo:</label>
            <input
              type="text"
              value={valorMinimo}
              onChange={(e) => setValorMinimo(e.target.value)}
            />
          </div>
          <div className={styles.filtroItem}>
            <label>Valor máximo:</label>
            <input
              type="text"
              value={valorMaximo}
              onChange={(e) => setValorMaximo(e.target.value)}
            />
          </div>
          <div className={styles.filtroItem}>
            <button className={styles.botaoLimpar} onClick={limparFiltros}>Limpar</button>
          </div>
        </div>

        {veiculosFiltrados.length === 0 ? (
          <p>Nenhum veículo encontrado.</p>
        ) : (
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Ano</th>
                <th>Valor</th>
                {logado && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {veiculosFiltrados.map((veiculo) => (
                <tr key={veiculo.id}>
                  <td>{veiculo.marca?.nome}</td>
                  <td>{veiculo.modelo}</td>
                  <td>{veiculo.ano}</td>
                  <td>
                    {veiculo.valor.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                  {logado && (
                    <td>
                      <button
                        className={styles.botaoAlterar}
                        onClick={() => router.push(`/veiculos/editar/${veiculo.id}`)}
                      >
                        Editar
                      </button>
                      <button
                        className={styles.botaoExcluir}
                        onClick={() => excluirVeiculo(veiculo.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {logado && (
          <div className={styles.botoesGrupo}>
            <button
              className={styles.botaoIncluir}
              onClick={() => router.push('/veiculos/cadastrar')}
            >
              Incluir
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
