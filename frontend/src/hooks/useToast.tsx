import React, { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState<{ id: string; message: string; type: string }[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // 3 second baad khud hi khatam ho jaye
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
};

// UI Component for Toasts
export const ToastContainer = ({ toasts, removeToast }: any) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast: any) => (
        <div
          key={toast.id}
          className={`p-4 rounded shadow-lg text-white min-w-[200px] flex justify-between items-center ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          <span>{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="ml-4 font-bold">×</button>
        </div>
      ))}
    </div>
  );
};