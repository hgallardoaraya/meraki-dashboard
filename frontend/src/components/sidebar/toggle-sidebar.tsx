import React from 'react';

interface ToggleSidebarProps {
  onClick: (event: React.MouseEvent<SVGSVGElement>) => void;
}

const ToggleSidebar: React.FC<ToggleSidebarProps> = ({ onClick }) => {
  return (
    <svg
      onClick={onClick}      
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="p-1 cursor-pointer rounded-full w-8 h-8 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-gray-200"
      tabIndex={0}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
};

export default ToggleSidebar;
