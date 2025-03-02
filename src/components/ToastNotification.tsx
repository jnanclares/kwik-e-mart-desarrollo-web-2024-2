"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, AlertTriangle, XCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning";

interface KwimiToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number; // en milisegundos
}

export const KwimiToast: React.FC<KwimiToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onClose();
        setIsExiting(false);
      }, 300); // duración de la animación de salida
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-6 w-6 text-white" />;
      case "error":
        return <XCircle className="h-6 w-6 text-white" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-white" />;
      default:
        return <CheckCircle className="h-6 w-6 text-white" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-[#2D7337]";
      case "error":
        return "bg-[#CC0000]";
      case "warning":
        return "bg-[#F59E0B]";
      default:
        return "bg-[#2D7337]";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
        isExiting ? "opacity-0 translate-y-[-20px]" : "opacity-100 translate-y-0"
      }`}
    >
      <div
        className={`${getBgColor()} border-4 border-[#FED41D] shadow-lg rounded-lg p-4 max-w-xs flex items-center gap-3`}
        style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}
      >
        <div className="shrink-0">{getIcon()}</div>
        <p className="text-white font-medium flex-1">{message}</p>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => {
              onClose();
              setIsExiting(false);
            }, 300);
          }}
          className="text-white hover:text-[#FED41D] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// Componente de contexto para gestionar múltiples toasts
interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  hideToast: () => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
    duration?: number;
  }>({
    message: "",
    type: "success",
    isVisible: false,
    duration: 3000,
  });

  const showToast = (message: string, type: ToastType, duration = 3000) => {
    setToast({
      message,
      type,
      isVisible: true,
      duration,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <KwimiToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};