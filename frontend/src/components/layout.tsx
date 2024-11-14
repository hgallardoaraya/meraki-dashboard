import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
    children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/gastos">Gastos</Link>
            </li>
            <li>
              <Link to="/estadisticas">Estadísticas</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        {children}
      </main>
      <footer>
        <p>Footer Content</p>
      </footer>
    </div>
  );
};

export default Layout;
