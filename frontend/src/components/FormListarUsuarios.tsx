'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import styles from '@/styles/FormListarUsuarios.module.css';
import { useRouter } from 'next/navigation';

interface Usuario {
  id: string;
  nome: string;
  email: string;
}

export default function FormListarUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function carregarUsuarios() {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Sessão expirada. Faça login novamente.');
          router.push('/entrar');
          return;
        }
    
        try {
          const response = await fetch('http://localhost:3000/api/usuarios', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          const lista = Array.isArray(data) ? data : data.usuarios || [];
          setUsuarios(lista);
        } catch (error) {
          console.error('Erro ao carregar usuários:', error);
        }
      }

    carregarUsuarios();
}, [router]); 

  const excluirUsuario = async (id: string) => {
    if (!confirm('Deseja realmente excluir este usuário?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      router.push('/entrar');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert('Usuário excluído com sucesso!');
        setUsuarios((prev) => prev.filter((u) => u.id !== id));
      } else {
        const erro = await res.json();
        alert(erro.mensagem || 'Erro ao excluir usuário.');
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      alert('Erro inesperado.');
    }
  };

  return (
    <Layout titulo="Listagem de Usuários">
      <div className={styles.container}>
        <h2 className={styles.titulo}>Usuários Cadastrados</h2>
        {usuarios.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>
        ) : (
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nome}</td>
                  <td>{usuario.email}</td>
                  <td>
                    <button
                      className={styles.botaoAlterar}
                      onClick={() => router.push(`/usuarios/editar/${usuario.id}`)}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.botaoExcluir}
                      onClick={() => excluirUsuario(usuario.id)}
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
            onClick={() => router.push('/usuarios/cadastrar')}
          >
            Incluir
          </button>
        </div>
      </div>
    </Layout>
  );
}
