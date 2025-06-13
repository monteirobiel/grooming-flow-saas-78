
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
    setAppointments([]);
    return [];
  };

  // Salvar agendamentos no localStorage
  const saveAppointments = (newAppointments: Appointment[]) => {
    console.log('💾 Salvando agendamentos:', newAppointments);
    localStorage.setItem('appointments', JSON.stringify(newAppointments));
    setAppointments(newAppointments);
    
    // Disparar múltiplos eventos para garantir sincronização
    console.log('📡 Disparando eventos de sincronização');
    
    // Evento customizado
    window.dispatchEvent(new CustomEvent('appointmentsUpdated', { 
      detail: newAppointments 
    }));
    
    // Evento de storage change simulado
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'appointments',
      newValue: JSON.stringify(newAppointments),
      oldValue: null,
      storageArea: localStorage
    }));
    
    // Forçar re-render após um pequeno delay
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('forceReload'));
    }, 100);
  };

  // Adicionar novo agendamento
  const addAppointment = (appointment: Appointment) => {
    console.log('➕ Adicionando novo agendamento:', appointment);
    const currentAppointments = loadAppointments(); // Recarregar antes de adicionar
    const updatedAppointments = [appointment, ...currentAppointments];
    console.log('📝 Lista atualizada de agendamentos:', updatedAppointments);
    saveAppointments(updatedAppointments);
  };

  // Atualizar agendamento existente
  const updateAppointment = (updatedAppointment: Appointment) => {
    console.log('✏️ Atualizando agendamento:', updatedAppointment);
    const currentAppointments = loadAppointments(); // Recarregar antes de atualizar
    const updatedAppointments = currentAppointments.map(apt => 
      apt.id === updatedAppointment.id ? updatedAppointment : apt
    );
    saveAppointments(updatedAppointments);
  };

  // Atualizar status do agendamento
  const updateAppointmentStatus = (id: number, status: string) => {
    console.log('🔄 Atualizando status do agendamento:', id, 'para:', status);
    const currentAppointments = loadAppointments(); // Recarregar antes de atualizar
    const updatedAppointments = currentAppointments.map(apt => 
      apt.id === id ? { ...apt, status } : apt
    );
    saveAppointments(updatedAppointments);
  };

  // Deletar agendamento
  const deleteAppointment = (id: number) => {
    console.log('🗑️ Deletando agendamento:', id);
    const currentAppointments = loadAppointments(); // Recarregar antes de deletar
    const updatedAppointments = currentAppointments.filter(apt => apt.id !== id);
    saveAppointments(updatedAppointments);
  };

  // Carregar dados na inicialização
  useEffect(() => {
    console.log('🚀 Inicializando useAppointments');
    loadAppointments();
  }, []);

  // Escutar mudanças de outros componentes
  useEffect(() => {
    console.log('👂 Configurando listeners para sincronização');
    
    const handleAppointmentsUpdate = (event: CustomEvent) => {
      console.log('📨 Recebido evento appointmentsUpdated:', event.detail);
      setAppointments(event.detail);
    };

    const handleForceReload = () => {
      console.log('🔄 Forçando recarregamento');
      loadAppointments();
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'appointments') {
        console.log('💾 Detectada mudança no localStorage');
        loadAppointments();
      }
    };

    window.addEventListener('appointmentsUpdated', handleAppointmentsUpdate as EventListener);
    window.addEventListener('forceReload', handleForceReload as EventListener);
    window.addEventListener('storage', handleStorageChange as EventListener);
    
    return () => {
      console.log('🧹 Removendo listeners');
      window.removeEventListener('appointmentsUpdated', handleAppointmentsUpdate as EventListener);
      window.removeEventListener('forceReload', handleForceReload as EventListener);
      window.removeEventListener('storage', handleStorageChange as EventListener);
    };
  }, []);

  // Log sempre que appointments mudar
  useEffect(() => {
    console.log('📊 Estado atual de appointments no hook:', appointments);
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
