import { Link } from "react-router-dom"
import ToggleSidebar from "./toggle-sidebar";
import React, { useEffect, useState } from "react";
import logoMeraki from "@/assets/meraki-logo.png" // ruta relativa al archivo
import "./sidebar.css"
import { useLocation } from "react-router-dom";
import { RouteItem } from "./sidebar";
import HomeIcon from "./home-icon";
import BillsIcon from "./bills-icon";
import StatisticIcon from "./statistics-icon";

const routeItems:RouteItem[] = [
  {
    path: "/",
    name: "Inicio",
    icon: <HomeIcon/>,
    hasNestedRoutes: false,    
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
      }
    ]
  },
  {
    path: "/estadisticas",
    name: "Estadísticas",
    icon: <StatisticIcon/>,
    hasNestedRoutes: false,
  },
]

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [openNavItem, setOpenNavItem] = useState<string>("");
  const location = useLocation()
  const currentPath = location.pathname

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActive = (r: RouteItem): boolean => {    
    if (!r.hasNestedRoutes) {
      return currentPath == r.path
    } else if (r.nestedRoutes !== undefined && r.nestedRoutes != null) {            
      return r.nestedRoutes.some(n => currentPath == n.path )
    }
    return false
  }

  const handleNavParentItemClick = (r: RouteItem): void => {
    setIsSidebarOpen(true);
    if(openNavItem == r.name) {
      setOpenNavItem("")
    } else {
      setOpenNavItem(r.name)
    }
  }

  return(
    <>
      <div className={`h-screen flex flex-col justify-between border-r p-4 shadow-md ${isSidebarOpen ? 'items-start w-240px' : 'items-center w-fit'}`}>      
        <div className="flex flex-col gap-6 w-full">
          <div className="w-full px-4">
            <ToggleSidebar onClick={toggleSidebar} />          
          </div>
          <nav className="w-full select-none">
            <ul className="flex flex-col items-start">
              {routeItems.map((r, i) => (
                <>
                  <li className={`py-2 px-4 rounded-md w-full ${(isActive(r)) ? "bg-blue-100 text-blue-800 fill-blue-800 font-semibold" : "text-gray-900"}`} key={`nav-route${i}`}>
                    {
                      r.hasNestedRoutes ? 
                      (
                        <>
                          <div className={`flex items-center hover:text-blue-900 hover:font-semibold cursor-pointer bg-inherit ${isSidebarOpen && "gap-2"}`} onClick={() => handleNavParentItemClick(r)}>
                            {r.icon && React.cloneElement(r.icon, { variant: isActive(r) ? "solid" : "outline" })}
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
                    openNavItem == r.name
                    &&
                    <ul className="px-4">
                      { 
                        r.nestedRoutes?.map((n, j) => (  
                          <li className={`py-2 px-4 rounded-md w-full ${(isActive(r)) ? "text-blue-800 font-semibold" : "text-gray-900"}`} key={`nav-sub-route${j}`}>
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
                </>
                
              ))}
            </ul>
          </nav>
        </div>
        {
          isSidebarOpen 
          &&
          <div>
            <img src={logoMeraki} alt="Logo Meraki Bowl" />
          </div>
        }
      </div>    
    </>
  )
}

export default Sidebar;