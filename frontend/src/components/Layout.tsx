'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../styles/Layout.module.css';

interface LayoutProps {
  children: ReactNode;
  titulo?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, titulo = 'Carango Bom' }) => {
  const [logado, setLogado] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLogado(!!token);
  }, []);

  // ✅ Aqui está o item 2: função de logout
  function handleLogout() {
    localStorage.removeItem('token');
    setLogado(false);
    router.push('/entrar');
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1>{titulo}</h1>
      </header>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <nav>
            <ul>
              {!logado && <li><Link href="/entrar">Entrar</Link></li>}
              <li><Link href="/">Veículos</Link></li>
              {logado && <li><Link href="/marcas/listar">Marcas</Link></li>}
              {logado && <li><Link href="/usuarios/listar">Usuários</Link></li>}
              {logado && <li><Link href="/veiculos/dashboard">Dashboard</Link></li>}
              {logado && (
                <li>
                  <button onClick={handleLogout} className={styles.logoutBotao}>
                    Sair
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </aside>
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
