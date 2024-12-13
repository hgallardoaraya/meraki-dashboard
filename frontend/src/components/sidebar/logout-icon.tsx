import { ReactElement } from "react";

interface LogoutIconProps {
  variant?: "outline" | "solid"; // Puedes restringir los valores de variant a "outline" o "solid"
}

const LogoutIcon: React.FC<LogoutIconProps> = ({ variant }) => {
  return renderIconByVariant(variant || "default");
};

const renderIconByVariant = (variant: "outline" | "solid" | "default"): ReactElement => {
  switch (variant) {
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 p-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
      )
  }
};

export default LogoutIcon;