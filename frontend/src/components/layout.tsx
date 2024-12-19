import { ReactNode } from 'react';
import Sidebar from "./sidebar/sidebar.tsx"
import { useSelector } from 'react-redux';
import { AuthState } from '@/auth/authSlice.ts';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isLoggedIn } = useSelector((state: { auth: AuthState }) => state.auth);  

  return (
    <div className="flex">      
      {
        isLoggedIn 
        &&
        (
          <>
            <Sidebar/>      
            <main
              className="flex-1 transition-margin duration-300 bg-gray-50 p-4"
            >        
              {children}
            </main>
          </>
        )
      }
      {
        !isLoggedIn 
        &&
        (
          <>            
            <main
              className="w-full h-screen bg-gray-50 p-4 flex justify-center items-center"
            >        
              {children}
            </main>
          </>
        )
      }
            
    </div>
  );
};

export default Layout;
