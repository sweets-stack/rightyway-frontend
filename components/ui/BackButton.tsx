import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  label?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  label = 'Back to Shop', 
  className = '' 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Use navigate(-1) to go back in browser history
    // This preserves scroll position and filter state
    navigate(-1);
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-2 text-brand-maroon hover:text-brand-gold transition-colors duration-200 ${className}`}
      aria-label="Go back"
    >
      {/* Left Arrow SVG Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default BackButton;