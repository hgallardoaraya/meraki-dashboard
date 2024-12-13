import { LoginForm } from "@/components/login/login-form";
import { Button } from "@/components/ui/button";
import logoMeraki from "@/assets/meraki-logo.png"

const LoginPage = () => {
  return (          
    <>
      <div className="bg-white rounded-md border border-gray-100 p-8 shadow-sm md:w-30-rem w-screen">      
        <div className="flex flex-col gap-6 justify-center items-center">        
          <h1 className="font-medium text-3xl">Inicio de sesión</h1>      
          <LoginForm/>
        </div>
      </div>
      <img src={logoMeraki} alt="Logo Meraki Bowl" height={"200px"} width={"200px"} className="absolute bottom-4 left-4 hidden md:inline-block"/>
    </>
  );
};
  
export default LoginPage;
  