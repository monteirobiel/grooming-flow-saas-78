
import { useState } from "react";

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
  const [services, setServices] = useState<Service[]>(initialServices);

  const getServicePrice = (serviceName: string): number => {
    const service = services.find(s => s.nome === serviceName);
    return service?.preco || 0;
  };

  const getServiceNames = (): string[] => {
    return services.map(s => s.nome);
  };

  return {
    services,
    setServices,
    getServicePrice,
    getServiceNames
  };
};
