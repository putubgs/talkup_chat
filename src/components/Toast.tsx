// Toast.tsx
import React, { useEffect, useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ToastProps {
  message: string;
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, visible }) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
    let timer: NodeJS.Timeout;
    if (visible) {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000); // 5 seconds
    }
    return () => {
      clearTimeout(timer);
    };
  }, [visible]);

  return isVisible ? (
    <div className="fixed top-0 left-0 mt-6 ml-6 bg-green-500 text-white py-2 px-4 rounded-md shadow-md text-sm max-w-sm flex items-center z-50">
      <CheckCircleIcon />
      <span className="ml-2">{message}</span>
    </div>
  ) : null;
};
