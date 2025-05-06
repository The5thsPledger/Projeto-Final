'use client';

import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import styles from '../styles/FormListarVeiculo.module.css';
import { useRouter } from 'next/navigation';

interface Marca {
  id: string;
  nome: string;
}

interface Veiculo {
  id: string;
  modelo: string;
  ano: number;
  valor: number;
  marca: Marca;
}

const FormListarVeiculos: React.FC = () => {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [marcaId, setMarcaId] = useState('');
  const [ano, setAno] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchMarcas();
    fetchVeiculos();
  }, []);

  const fetchMarcas = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/marcas');
      const data = await res.json();
      setMarcas(data);
    } catch (error) {
      console.error('Erro ao buscar marcas:', error);
    }
  };

  const fetchVeiculos = async () => {
    try {
      const params = new URLSearchParams();
      if (marcaId) params.append('marca', marcaId);
      if (ano) params.append('ano', ano);
      if (min) params.append('min', min);
      if (max) params.append('max', max);

      const res = await fetch(`http://localhost:3000/api/veiculos?${params.toString()}`);
      const data = await res.json();
      setVeiculos(data);
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
    }
  };

  const limparFiltros = () => {
    setMarcaId('');
    setAno('');
    setMin('');
    setMax('');
    fetchVeiculos();
  };

  const excluirVeiculo = async (id: string) => {
    if (!confirm('Deseja realmente excluir este veículo?')) return;

    try {
      const res = await fetch(`http://localhost:3000/api/veiculos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        alert('Veículo excluído com sucesso!');
        setVeiculos((prev) => prev.filter((v) => v.id !== id));
      } else {
        alert('Erro ao excluir veículo');
      }
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
      alert('Erro ao excluir veículo');
    }
  };

  return (
    <Layout titulo="Listagem de veículos">
      <div className={styles.container}>
        <h2 className={styles.titulo}>Veículos Registrados</h2>

        <div className={styles.filtroBox}>
          <div className={styles.filtroLinha}>
            <div className={styles.filtroItem}>
              <label>Marca:</label>
              <select value={marcaId} onChange={(e) => setMarcaId(e.target.value)}>
                <option value="">Todas</option>
                {marcas.map((m) => (
                  <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
              </select>
            </div>
            <div className={styles.filtroItem}>
              <label>Ano:</label>
              <input type="number" value={ano} onChange={(e) => setAno(e.target.value)} />
            </div>
            <div className={styles.filtroItem}>
              <label>Valor mínimo:</label>
              <input type="number" value={min} onChange={(e) => setMin(e.target.value)} />
            </div>
            <div className={styles.filtroItem}>
              <label>Valor máximo:</label>
              <input type="number" value={max} onChange={(e) => setMax(e.target.value)} />
            </div>
            <div className={styles.botoesFiltro}>
              <button onClick={fetchVeiculos} className={styles.botaoFiltrar}>Filtrar</button>
              <button onClick={limparFiltros} className={styles.botaoLimpar}>Limpar</button>
            </div>
          </div>
        </div>

        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Ano</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {veiculos.map((v) => (
              <tr key={v.id}>
                <td>{v.marca.nome}</td>
                <td>{v.modelo}</td>
                <td>{v.ano}</td>
                <td>R$ {Number(v.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td>
                  <button
                    className={styles.botaoEditar}
                    onClick={() => router.push(`/veiculos/editar/${v.id}`)}
                  >Editar</button>
                  <button
                    className={styles.botaoExcluir}
                    onClick={() => excluirVeiculo(v.id)}
                  >Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.rodape}>
          <button
            className={styles.botaoIncluir}
            onClick={() => router.push('/veiculos/cadastrar')}
          >Incluir</button>
        </div>
      </div>
    </Layout>
  );
};

export default FormListarVeiculos;
