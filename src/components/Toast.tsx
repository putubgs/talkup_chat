import React, { useEffect, useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

interface ToastProps {
  message: string;
  visible: boolean;
  error?: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, visible, error = false }) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
    let timer: NodeJS.Timeout;
    if (visible) {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [visible]);

  return isVisible ? (
    <div className={`fixed top-0 left-0 mt-6 ml-6 text-white py-2 px-4 rounded-md shadow-md text-sm max-w-sm flex items-center z-50 ${error ? 'bg-red-500' : 'bg-green-500'}`}>
      {error ? <CloseIcon /> : <CheckCircleIcon />}
      <span className="ml-2">{message}</span>
    </div>
  ) : null;
};
