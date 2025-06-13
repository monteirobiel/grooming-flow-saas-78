
import { useState, useEffect } from "react";

export interface Service {
  id: number;
  nome: string;
  preco: number;
}

const initialServices: Service[] = [
  { id: 1, nome: "Corte", preco: 30.00 },
  { id: 2, nome: "Barba", preco: 25.00 },
  { id: 3, nome: "Corte + Barba", preco: 45.00 },
  { id: 4, nome: "Sobrancelha", preco: 15.00 },
  { id: 5, nome: "Lavagem", preco: 20.00 }
];

export const useServices = () => {
  const [services, setServices] = useState<Service[]>(() => {
    const savedServices = localStorage.getItem('barbershop-services');
    if (savedServices) {
      return JSON.parse(savedServices);
    }
    return initialServices;
  });

  // Salvar no localStorage sempre que os serviços mudarem
  useEffect(() => {
    localStorage.setItem('barbershop-services', JSON.stringify(services));
    
    // Disparar evento para notificar outros componentes
    window.dispatchEvent(new CustomEvent('servicesUpdated', { 
      detail: { services } 
    }));
  }, [services]);

  const getServicePrice = (serviceName: string): number => {
    const service = services.find(s => s.nome === serviceName);
    return service?.preco || 0;
  };

  const getServiceNames = (): string[] => {
    return services.map(s => s.nome);
  };

  const addService = (service: Omit<Service, 'id'>): void => {
    const newService = {
      ...service,
      id: Date.now()
    };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (id: number, updatedService: Omit<Service, 'id'>): void => {
    setServices(prev => prev.map(s => 
      s.id === id ? { ...updatedService, id } : s
    ));
  };

  const deleteService = (id: number): void => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  return {
    services,
    setServices,
    getServicePrice,
    getServiceNames,
    addService,
    updateService,
    deleteService
  };
};
