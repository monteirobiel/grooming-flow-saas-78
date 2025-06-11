
import { useState, useEffect } from 'react';

export interface Appointment {
  id: number;
  cliente: string;
  telefone: string;
  servico: string;
  barbeiro: string;
  data: string;
  horario: string;
  valor: number;
  status: string;
}

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Carregar agendamentos do localStorage
  const loadAppointments = () => {
    const stored = localStorage.getItem('appointments');
    if (stored) {
      const parsedAppointments = JSON.parse(stored);
      setAppointments(parsedAppointments);
      return parsedAppointments;
    }
    return [];
  };

  // Salvar agendamentos no localStorage
  const saveAppointments = (newAppointments: Appointment[]) => {
    localStorage.setItem('appointments', JSON.stringify(newAppointments));
    setAppointments(newAppointments);
    
    // Disparar evento customizado para notificar outros componentes
    window.dispatchEvent(new CustomEvent('appointmentsUpdated', { 
      detail: newAppointments 
    }));
  };

  // Adicionar novo agendamento
  const addAppointment = (appointment: Appointment) => {
    const updatedAppointments = [...appointments, appointment];
    saveAppointments(updatedAppointments);
  };

  // Atualizar agendamento existente
  const updateAppointment = (updatedAppointment: Appointment) => {
    const updatedAppointments = appointments.map(apt => 
      apt.id === updatedAppointment.id ? updatedAppointment : apt
    );
    saveAppointments(updatedAppointments);
  };

  // Atualizar status do agendamento
  const updateAppointmentStatus = (id: number, status: string) => {
    const updatedAppointments = appointments.map(apt => 
      apt.id === id ? { ...apt, status } : apt
    );
    saveAppointments(updatedAppointments);
  };

  // Carregar dados na inicialização
  useEffect(() => {
    loadAppointments();
  }, []);

  // Escutar mudanças de outros componentes
  useEffect(() => {
    const handleAppointmentsUpdate = (event: CustomEvent) => {
      setAppointments(event.detail);
    };

    window.addEventListener('appointmentsUpdated', handleAppointmentsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('appointmentsUpdated', handleAppointmentsUpdate as EventListener);
    };
  }, []);

  return {
    appointments,
    addAppointment,
    updateAppointment,
    updateAppointmentStatus,
    loadAppointments
  };
};
