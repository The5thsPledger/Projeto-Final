import React, { ReactNode } from 'react';
import styles from '../styles/Layout.module.css';

interface LayoutProps {
  children: ReactNode;
  titulo?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, titulo = 'Carango Bom' }) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1>{titulo}</h1>
      </header>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <nav>
            <ul>
              <li><a href="/entrar">Entrar</a></li>
              <li><a href="/veiculos">Veículos</a></li>
              <li><a href="/marcas">Marcas</a></li>
              <li><a href="/usuarios">Usuários</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/sair">Sair</a></li>
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