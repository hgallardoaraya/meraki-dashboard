import { ReactNode } from 'react';
import Sidebar from "./sidebar/sidebar.tsx"

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex">      
    
      <Sidebar/>
      {/* Main Content */}
      <main
        className="flex-1 transition-margin duration-300 bg-gray-50 p-4"
      >        
        {children}
      </main>
    </div>
  );
};

export default Layout;
