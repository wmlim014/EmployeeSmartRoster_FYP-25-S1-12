import { createContext, useContext, useState, ReactNode } from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertOptions {
  type?: AlertType;
  duration?: number;
  closable?: boolean;
}

interface AlertContextType {
  showAlert: (title: string, content: string, message: string, options?: AlertOptions) => void;
  hideAlert: () => void;
  alert: {
    visible: boolean;
    title: string;
    content: string;
    message: string;
    type: AlertType;
    closable: boolean;
  };
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState({
    visible: false,
    title: '',
    content: '',
    message: '',
    type: 'success' as AlertType,
    closable: true
  });

  const showAlert = (title: string, 
                      content: string, 
                      message: string, 
                      options: AlertOptions = {}) => {
    const { type = 'success', duration = 3000, closable = true } = options;
    
    setAlert({
      visible: true,
      title,
      content,
      message,
      type,
      closable
    });

    if (duration > 0) {
      setTimeout(hideAlert, duration);
    }
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, visible: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert, alert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};