import { Link } from "react-router-dom"
import ToggleSidebar from "./toggle-sidebar";
import React, { useEffect, useState } from "react";
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
    group: "home"
  },
  {
    path: "/gastos",
    name: "Gastos",
    icon: <BillsIcon/>,
    hasNestedRoutes: true,
    group: "bills",
    nestedRoutes: [
      {
        path: "/gastos/ingresar",
        name: "Ingresar gastos",        
        hasNestedRoutes: false,
        group: "bills"
      }
    ]
  },
  {
    path: "/estadisticas",
    name: "Estadísticas",
    icon: <StatisticIcon/>,
    hasNestedRoutes: false,
    group: "stats"
  },
]

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<string>("Inicio");
  const location = useLocation()
  const currentPath = location.pathname

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActive = (path: string): boolean => {
    return currentPath == path
  }

  const selectGroup = (name: string): void => {
    setSelectedGroup(name)
  }

  return(
    <>
      <div className={`min-h-screen flex flex-col gap-6 border-r p-4 shadow-md ${isSidebarOpen ? 'items-start w-240px' : 'items-center w-fit'}`}>      
        <div className="w-full px-4">
          <ToggleSidebar onClick={toggleSidebar} />
        </div>
        <nav className="w-full">
          <ul className="flex flex-col gap-4 items-start">
            {routeItems.map((r, i) => (
              <li className={`py-2 px-4 rounded-md w-full ${(isActive(r.path)) && "bg-gray-200"}`} key={`nav-route${i}`}>
                {
                  r.hasNestedRoutes ? 
                  (
                    <div                      
                      className={`text-gray-700`}
                      onClick={() => selectGroup(r.group)}
                    >
                      <div className={`flex items-center py-2 hover:text-gray-900 hover:font-semibold cursor-pointer ${isSidebarOpen && "gap-2"} ${selectedGroup == r.group && "text-gray-900 font-semibold"}`}>
                        {r.icon && React.cloneElement(r.icon, { variant: isActive(r.path) ? "solid" : "outline" })}
                        { isSidebarOpen && r.name }                                                
                      </div>
                      {
                        isSidebarOpen
                        &&
                        (selectedGroup == r.group || r.nestedRoutes?.some(n => isActive(n.path)))
                        &&
                        <ul>
                          { 
                            r.nestedRoutes?.map((n, j) => (  
                              <li className={`py-2 px-4 rounded-md w-full ${(isActive(n.path)) && "bg-gray-200"}`} key={`nav-sub-route${j}`}>
                                <Link 
                                  to={n.path} 
                                  className={`text-gray-700 hover:text-gray-900 hover:font-semibold ${isActive(n.path) && "text-gray-900 font-semibold"}`}
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
                  )
                  :
                  (
                    <Link 
                      to={r.path} 
                      className={`text-gray-700 hover:text-gray-900 hover:font-semibold ${isActive(r.path) && "text-gray-900 font-semibold"}`}
                      onClick={() => selectGroup(r.group)}
                    >
                      <div className={`flex items-center ${isSidebarOpen && "gap-2"}`}>
                        {r.icon && React.cloneElement(r.icon, { variant: isActive(r.path) ? "solid" : "outline" })}
                        { isSidebarOpen && r.name}
                      </div>
                    </Link>                
                  )
                }                
              </li>            
            ))}
          </ul>
        </nav>
      </div>    
    </>
  )
}

export default Sidebar;