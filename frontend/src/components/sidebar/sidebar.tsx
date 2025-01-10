import { Link, useNavigate } from "react-router-dom"
import ToggleSidebar from "./toggle-sidebar";
import React, { useState } from "react";
import logoMeraki from "@/assets/meraki-logo.png" // ruta relativa al archivo
import { useLocation } from "react-router-dom";
import BillsIcon from "./bills-icon";
import StatisticIcon from "./statistics-icon";
import { RouteItem } from "@/types/sidebar";
import MaintainerIcon from "./maintainer-icon";
import SalesIcon from "./sales-icon";
import { useSelector } from "react-redux";
import { AuthState, logout } from "@/auth/authSlice";
import LogoutIcon from "./logout-icon";
import { useAppDispatch } from "@/store";

const routeItems:RouteItem[] = [
  {
    path: "/",
    name: "Estadísticas",
    icon: <StatisticIcon/>,
    hasNestedRoutes: false,
    roles: ["ADMIN"]
  },
  {
    path: "/gastos",
    name: "Gastos",
    icon: <BillsIcon/>,
    hasNestedRoutes: true,
    nestedRoutes: [
      {
        path: "/gastos/ingresar",
        name: "Ingresar gastos",        
        hasNestedRoutes: false,
        roles: ["ADMIN"],
      },
      {
        path: "/gastos/listar",
        name: "Listado de gastos",        
        hasNestedRoutes: false,
        roles: ["ADMIN"],
      }
    ],
    roles: ["ADMIN"],
  },
  {
    path: "/mantenedores",
    name: "Mantenedores",
    icon: <MaintainerIcon/>,
    hasNestedRoutes: true,
    nestedRoutes: [
      {
        path: "/mantenedores/locales",
        name: "Locales",        
        hasNestedRoutes: false,
        roles: ["ADMIN"],
      },
      {
        path: "/mantenedores/categorias",
        name: "Categorías",        
        hasNestedRoutes: false,
        roles: ["ADMIN"],
      },
      {
        path: "/mantenedores/tipos",
        name: "Tipos",        
        hasNestedRoutes: false,
        roles: ["ADMIN"],
      },
      {
        path: "/mantenedores/proveedores",
        name: "Proveedores",        
        hasNestedRoutes: false,
        roles: ["ADMIN"],
      }
    ],
    roles: ["ADMIN"],
  },
  {
    path: "/ventas/listar",
    name: "Ventas",
    icon: <SalesIcon/>,
    hasNestedRoutes: false,
    roles: ["ADMIN"],
  },
]

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [openNavItem, setOpenNavItem] = useState<string>("");
  const location = useLocation()
  const currentPath = location.pathname  
  const dispatcher = useAppDispatch();
  const navigate = useNavigate();
  const { role, isLoggedIn } = useSelector((state: { auth: AuthState }) => state.auth);  

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActive = (r: RouteItem): boolean => {    
    return currentPath == r.path;
  }
  
  const someNestedRouteActive = (r: RouteItem): boolean => {
    if(!r.hasNestedRoutes || r.nestedRoutes == undefined) return false;
    return r.nestedRoutes?.some(n => isActive(n));
  }

  const handleNavParentItemClick = (r: RouteItem): void => {
    setIsSidebarOpen(true);
    if(openNavItem == r.name) {
      setOpenNavItem("")
    } else {
      setOpenNavItem(r.name)
    }
  }

  const handleLogout = () => {
    dispatcher(logout());
    navigate("/login");
  }

  return(
    <>
      { 
        isLoggedIn
        &&
        <div className={`sticky top-0 left-0 h-screen flex flex-col justify-between border-r p-4 shadow-md ${isSidebarOpen ? 'items-start w-240px' : 'items-center w-fit'}`}>      
          <div className="flex flex-col justify-between h-full w-full mb-6">
            <div className="flex flex-col gap-6 w-full">
              <div className="w-full px-4">
                <ToggleSidebar onClick={toggleSidebar} />          
              </div>
              <nav className="w-full select-none">
                <ul className="flex flex-col items-start">
                  {routeItems.map((r, i) => (
                    r.roles.includes(role) &&
                    <div className="w-full" key={`nav-route${i}`}>
                      <li className={`py-2 px-4 rounded-md w-full ${(isActive(r) || someNestedRouteActive(r)) ? "bg-blue-100 text-blue-800 fill-blue-800 font-semibold" : "text-gray-900"}`}>
                        {
                          r.hasNestedRoutes ? 
                          (
                            <>
                              <div className={`flex items-center hover:text-blue-900 hover:font-semibold cursor-pointer bg-inherit ${isSidebarOpen && "gap-2"}`} onClick={() => handleNavParentItemClick(r)}>
                                {r.icon && React.cloneElement(r.icon, { variant: someNestedRouteActive(r) ? "solid" : "outline" })}
                                { isSidebarOpen && r.name }                                                
                              </div>                                         
                            </>                                            
                          )
                          :
                          (
                            <Link 
                              to={r.path} 
                              className={`hover:text-blue-900 hover:font-semibold`}                        
                            >
                              <div className={`flex items-center ${isSidebarOpen && "gap-2"}`}>
                                {r.icon && React.cloneElement(r.icon, { variant: isActive(r) ? "solid" : "outline"})}
                                { isSidebarOpen && r.name}
                              </div>
                            </Link>                
                          )
                        }                
                      </li>            
                      {
                        isSidebarOpen
                        &&
                        openNavItem == r.name
                        &&
                        <ul className="px-4">
                          { 
                            r.nestedRoutes?.map((n, j) => (  
                              n.roles.includes(role) &&
                              <li className={`py-2 px-4 rounded-md w-full ${(isActive(n)) ? "text-blue-800 font-semibold" : "text-gray-900"}`} key={`nav-sub-route${j}`}>
                                <Link 
                                  to={n.path} 
                                  className={`hover:text-blue-900 hover:font-semibold`}
                                >
                                  <div className={`flex items-center ${isSidebarOpen && "gap-2"}`}>                                
                                    { isSidebarOpen && n.name}
                                  </div>
                                </Link>    
                              </li>
                            ))
                          }
                        </ul>
                      }    
                    </div>
                    
                  ))}
                </ul>
              </nav>
            </div>
            {              
              <div                  
                className={`text-red-600 font-medium px-4 cursor-pointer`}                    
                onClick={handleLogout}    
              >
                <div className={`flex items-center ${isSidebarOpen && "gap-2"}`}>
                  <LogoutIcon/>
                  { isSidebarOpen && "Cerrar sesión"}
                </div>
              </div>  
            }          
          </div>
          {
            isSidebarOpen 
            &&
            <div>
              <img src={logoMeraki} alt="Logo Meraki Bowl" />
            </div>
          }
        </div>    
      }
    </>
  )
}

export default Sidebar;