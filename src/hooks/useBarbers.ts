
import { useAuth } from "@/contexts/AuthContext";

export const useBarbers = () => {
  const { user, getRegisteredBarbers } = useAuth();

  const getAllAvailableBarbers = () => {
    const registeredBarbers = getRegisteredBarbers();
    let allBarbers = [...registeredBarbers];
    
    // Sempre adicionar o proprietário como barbeiro disponível
    if (user?.role === 'owner') {
      const ownerExists = allBarbers.some(b => b.id === user.id);
      if (!ownerExists) {
        allBarbers.unshift({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          specialty: 'Gestão e Cortes',
          position: 'gerente',
          role: 'owner',
          status: 'active',
          barbershopId: user.barbershopId
        });
      }
    }
    
    // Filtrar apenas barbeiros ativos
    return allBarbers.filter(barber => barber.status === 'active');
  };

  const getBarberById = (id: string) => {
    const allBarbers = getAllAvailableBarbers();
    return allBarbers.find(barber => barber.id === id);
  };

  const getBarberName = (id: string) => {
    const barber = getBarberById(id);
    return barber?.name || 'Barbeiro não encontrado';
  };

  return {
    getAllAvailableBarbers,
    getBarberById,
    getBarberName
  };
};
