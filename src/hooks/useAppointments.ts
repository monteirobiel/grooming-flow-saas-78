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
    console.log('🔍 Carregando agendamentos do localStorage...');
    const stored = localStorage.getItem('appointments');
    if (stored) {
      const parsedAppointments = JSON.parse(stored);
      console.log('📋 Agendamentos carregados:', parsedAppointments);
      setAppointments(parsedAppointments);
      return parsedAppointments;
    }
    console.log('📋 Nenhum agendamento encontrado no localStorage');
    return [];
  };

  // Salvar agendamentos no localStorage
  const saveAppointments = (newAppointments: Appointment[]) => {
    console.log('💾 Salvando agendamentos:', newAppointments);
    localStorage.setItem('appointments', JSON.stringify(newAppointments));
    setAppointments(newAppointments);
    
    // Disparar evento customizado para notificar outros componentes
    console.log('📡 Disparando evento appointmentsUpdated');
    window.dispatchEvent(new CustomEvent('appointmentsUpdated', { 
      detail: newAppointments 
    }));
  };

  // Adicionar novo agendamento
  const addAppointment = (appointment: Appointment) => {
    console.log('➕ Adicionando novo agendamento:', appointment);
    const updatedAppointments = [appointment, ...appointments]; // Novo agendamento primeiro
    console.log('📝 Lista atualizada de agendamentos:', updatedAppointments);
    saveAppointments(updatedAppointments);
  };

  // Atualizar agendamento existente
  const updateAppointment = (updatedAppointment: Appointment) => {
    console.log('✏️ Atualizando agendamento:', updatedAppointment);
    const updatedAppointments = appointments.map(apt => 
      apt.id === updatedAppointment.id ? updatedAppointment : apt
    );
    saveAppointments(updatedAppointments);
  };

  // Atualizar status do agendamento
  const updateAppointmentStatus = (id: number, status: string) => {
    console.log('🔄 Atualizando status do agendamento:', id, 'para:', status);
    const updatedAppointments = appointments.map(apt => 
      apt.id === id ? { ...apt, status } : apt
    );
    saveAppointments(updatedAppointments);
  };

  // Deletar agendamento
  const deleteAppointment = (id: number) => {
    console.log('🗑️ Deletando agendamento:', id);
    const updatedAppointments = appointments.filter(apt => apt.id !== id);
    saveAppointments(updatedAppointments);
  };

  // Carregar dados na inicialização
  useEffect(() => {
    console.log('🚀 Inicializando useAppointments');
    loadAppointments();
  }, []);

  // Escutar mudanças de outros componentes
  useEffect(() => {
    console.log('👂 Configurando listener para appointmentsUpdated');
    const handleAppointmentsUpdate = (event: CustomEvent) => {
      console.log('📨 Recebido evento appointmentsUpdated:', event.detail);
      setAppointments(event.detail);
    };

    window.addEventListener('appointmentsUpdated', handleAppointmentsUpdate as EventListener);
    
    return () => {
      console.log('🧹 Removendo listener appointmentsUpdated');
      window.removeEventListener('appointmentsUpdated', handleAppointmentsUpdate as EventListener);
    };
  }, []);

  // Log sempre que appointments mudar
  useEffect(() => {
    console.log('📊 Estado atual de appointments:', appointments);
  }, [appointments]);

  return {
    appointments,
    addAppointment,
    updateAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    loadAppointments
  };
};
