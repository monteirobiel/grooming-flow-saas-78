
import { useState, useEffect } from "react";

export const useCommission = () => {
  const [commission, setCommission] = useState<number>(() => {
    const savedCommission = localStorage.getItem('barbershop-comissao');
    return savedCommission ? parseFloat(savedCommission) : 15;
  });

  useEffect(() => {
    localStorage.setItem('barbershop-comissao', commission.toString());
    
    // Disparar evento para notificar outros componentes
    window.dispatchEvent(new CustomEvent('comissaoUpdated', { 
      detail: { comissao: commission } 
    }));
  }, [commission]);

  const updateCommission = (newCommission: number) => {
    setCommission(newCommission);
  };

  const calculateBarberEarnings = (serviceValue: number): number => {
    return (serviceValue * commission) / 100;
  };

  const calculateBarbershopEarnings = (serviceValue: number): number => {
    return serviceValue - calculateBarberEarnings(serviceValue);
  };

  return {
    commission,
    updateCommission,
    calculateBarberEarnings,
    calculateBarbershopEarnings
  };
};
