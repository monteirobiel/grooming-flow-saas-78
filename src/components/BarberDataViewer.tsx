
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DollarSign, Calendar, Clock, TrendingUp, Eye, Crown, User } from "lucide-react";
import { useBarbers } from "@/hooks/useBarbers";
import { useAppointments } from "@/hooks/useAppointments";

interface BarberDataViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barbeiros: any[];
  preSelectedBarberId?: string | null;
}

export const BarberDataViewer = ({ open, onOpenChange, barbeiros, preSelectedBarberId }: BarberDataViewerProps) => {
  const [selectedBarberId, setSelectedBarberId] = useState<string>("");
  const [comissaoPercentual, setComissaoPercentual] = useState(15);
  const { getAllAvailableBarbers } = useBarbers();
  const { appointments, loadAppointments } = useAppointments();

  // Carregar configuração de comissão do localStorage
  useEffect(() => {
    const savedComissao = localStorage.getItem('barbershop-comissao');
    if (savedComissao) {
      setComissaoPercentual(parseFloat(savedComissao));
    }
  }, []);

  // Escutar mudanças nos agendamentos - igual ao Dashboard
  useEffect(() => {
    console.log('🔄 BarberDataViewer - configurando listeners para sincronização');
    
    const handleAppointmentsUpdate = (event: CustomEvent) => {
      console.log('📨 BarberDataViewer - recebido evento appointmentsUpdated:', event.detail);
      loadAppointments();
    };

    const handleForceReload = () => {
      console.log('🔄 BarberDataViewer - forçando reload');
      loadAppointments();
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'appointments') {
        console.log('💾 BarberDataViewer - detectada mudança no localStorage de appointments');
        loadAppointments();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ BarberDataViewer - página ficou visível, recarregando dados');
        loadAppointments();
      }
    };
    
    // Múltiplos listeners para garantir sincronização - igual ao Dashboard
    window.addEventListener('appointmentsUpdated', handleAppointmentsUpdate as EventListener);
    window.addEventListener('forceReload', handleForceReload as EventListener);
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Verificar mudanças periodicamente
    const intervalId = setInterval(() => {
      loadAppointments();
    }, 2000);
    
    // Carregar dados imediatamente
    loadAppointments();
    
    return () => {
      console.log('🧹 BarberDataViewer - removendo todos os listeners');
      window.removeEventListener('appointmentsUpdated', handleAppointmentsUpdate as EventListener);
      window.removeEventListener('forceReload', handleForceReload as EventListener);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, [loadAppointments]);

  // Resetar seleção quando o dialog é fechado ou definir barbeiro pré-selecionado
  useEffect(() => {
    if (!open) {
      setSelectedBarberId("");
    } else if (preSelectedBarberId) {
      setSelectedBarberId(preSelectedBarberId);
    }
  }, [open, preSelectedBarberId]);

  // Buscar dados reais do barbeiro usando a mesma lógica do Dashboard
  const getBarberRealData = (barberId: string) => {
    try {
      const selectedBarber = getAllAvailableBarbers().find(b => b.id === barberId);
      if (!selectedBarber) {
        console.log('Barbeiro não encontrado:', barberId);
        return {
          faturamentoHoje: 0,
          faturamentoMes: 0,
          agendamentosHoje: 0,
          agendamentosConcluidos: 0,
          agendamentos: []
        };
      }

      console.log('📊 Calculando dados para barbeiro:', selectedBarber.name);
      console.log('📊 Total de appointments disponíveis:', appointments.length);
      
      // Filtrar agendamentos do barbeiro específico usando o nome - igual ao Dashboard
      const barberAppointments = appointments.filter((apt: any) => 
        apt.barbeiro === selectedBarber.name
      );
      
      console.log('📊 Appointments do barbeiro', selectedBarber.name, ':', barberAppointments);
      
      // Data atual
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      
      // Início do mês atual
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      // Agendamentos de hoje
      const todayAppointments = barberAppointments.filter((apt: any) => 
        apt.data === todayString
      );
      
      // Agendamentos concluídos de hoje - APENAS CONCLUÍDOS para faturamento
      const todayCompletedAppointments = todayAppointments.filter((apt: any) => 
        apt.status === 'concluido'
      );
      
      // Agendamentos do mês atual
      const currentMonthAppointments = barberAppointments.filter((apt: any) => {
        const aptDate = new Date(apt.data);
        return aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear;
      });
      
      // Agendamentos concluídos do mês atual - APENAS CONCLUÍDOS para faturamento
      const currentMonthCompletedAppointments = currentMonthAppointments.filter((apt: any) => 
        apt.status === 'concluido'
      );
      
      console.log('📊 Agendamentos hoje:', todayAppointments.length);
      console.log('📊 Agendamentos concluídos hoje:', todayCompletedAppointments.length);
      
      // Calcular faturamento - IGUAL AO DASHBOARD
      const calculateRevenue = (appointments: any[]) => {
        return appointments.reduce((total, apt) => {
          if (apt.status === 'concluido' && apt.valor) {
            return total + parseFloat(apt.valor);
          }
          return total;
        }, 0);
      };
      
      // Faturamento baseado APENAS em serviços concluídos
      const todayRevenue = calculateRevenue(todayCompletedAppointments);
      const monthRevenue = calculateRevenue(currentMonthCompletedAppointments);
      
      // Calcular o valor líquido que o barbeiro recebe (repasse)
      const todayBarberRevenue = todayCompletedAppointments.reduce((total, apt) => {
        const valor = apt.valor || 0;
        
        // Se for o proprietário, não aplica comissão
        if (selectedBarber.role === 'owner' || apt.barbeiro === 'Dono da Barbearia') {
          console.log(`💼 Serviço do proprietário ${apt.barbeiro}: R$ ${valor} (sem comissão)`);
          return total + valor;
        }
        
        // Para outros barbeiros, aplica o percentual de repasse
        const valorRepasse = valor * comissaoPercentual / 100;
        console.log(`💼 Repasse do funcionário ${apt.barbeiro}: R$ ${valor} -> R$ ${valorRepasse} (${comissaoPercentual}% repasse)`);
        return total + valorRepasse;
      }, 0);
      
      // Agendamentos recentes (últimos 5) - TODOS os status, igual ao Dashboard
      const recentAppointments = barberAppointments
        .sort((a: any, b: any) => new Date(b.data + ' ' + b.horario).getTime() - new Date(a.data + ' ' + a.horario).getTime())
        .slice(0, 5)
        .map((apt: any) => ({
          id: apt.id,
          cliente: apt.cliente || 'Cliente não informado',
          servico: apt.servico || 'Serviço não informado',
          horario: apt.horario || '00:00',
          valor: parseFloat(apt.valor) || 0,
          status: apt.status || 'pendente',
          data: apt.data
        }));
      
      console.log('📊 Faturamento hoje (bruto):', todayRevenue);
      console.log('📊 Faturamento hoje (líquido barbeiro):', todayBarberRevenue);
      console.log('📊 Faturamento mês:', monthRevenue);
      
      return {
        faturamentoHoje: todayRevenue, // Bruto
        faturamentoLiquido: todayBarberRevenue, // Líquido que o barbeiro recebe
        faturamentoMes: monthRevenue,
        agendamentosHoje: todayAppointments.length,
        agendamentosConcluidos: todayCompletedAppointments.length,
        agendamentos: recentAppointments
      };
    } catch (error) {
      console.error('❌ Erro ao buscar dados do barbeiro:', error);
      return {
        faturamentoHoje: 0,
        faturamentoLiquido: 0,
        faturamentoMes: 0,
        agendamentosHoje: 0,
        agendamentosConcluidos: 0,
        agendamentos: []
      };
    }
  };

  // Filtrar barbeiros disponíveis
  const availableBarbers = getAllAvailableBarbers();
  const selectedBarber = availableBarbers.find(b => b.id.toString() === selectedBarberId);
  const barberData = selectedBarberId ? getBarberRealData(selectedBarberId) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-primary text-primary-foreground';
      case 'concluido':
        return 'bg-green-500 text-white';
      case 'pendente':
        return 'bg-yellow-500 text-black';
      case 'cancelado':
        return 'bg-red-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'Confirmado';
      case 'concluido':
        return 'Concluído';
      case 'pendente':
        return 'Pendente';
      case 'cancelado':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const getBarberIcon = (barber: any) => {
    if (barber.role === 'owner' || barber.position === 'gerente') {
      return <Crown className="w-5 h-5 text-purple-600" />;
    }
    if (barber.position === 'administrador') {
      return <Crown className="w-5 h-5 text-primary" />;
    }
    return <User className="w-5 h-5 text-blue-600" />;
  };

  const getBarberLabel = (barber: any) => {
    if (barber.role === 'owner' || barber.position === 'gerente') {
      return 'Gerente';
    }
    if (barber.position === 'administrador') {
      return 'Administrador';
    }
    return 'Funcionário';
  };

  const handleClose = () => {
    setSelectedBarberId("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Relatórios do Barbeiro - Dados em Tempo Real
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Seletor de Barbeiro - só aparece se não há barbeiro pré-selecionado */}
          {!preSelectedBarberId && (
            <div>
              <label className="text-sm font-medium mb-2 block">Selecionar Barbeiro</label>
              <Select value={selectedBarberId} onValueChange={setSelectedBarberId}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um barbeiro" />
                </SelectTrigger>
                <SelectContent>
                  {availableBarbers.map((barbeiro) => (
                    <SelectItem key={barbeiro.id} value={barbeiro.id.toString()}>
                      <div className="flex items-center gap-2">
                        {getBarberIcon(barbeiro)}
                        <span>{barbeiro.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({getBarberLabel(barbeiro)})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Dados do Barbeiro Selecionado */}
          {selectedBarber && barberData && (
            <>
              {/* Header do Barbeiro */}
              <Card className="border-primary">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedBarber.role === 'owner' || selectedBarber.position === 'gerente'
                          ? 'bg-purple-500/10' 
                          : selectedBarber.position === 'administrador' 
                          ? 'bg-primary/10' 
                          : 'bg-blue-500/10'
                      }`}>
                        {getBarberIcon(selectedBarber)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{selectedBarber.name}</h3>
                        <p className="text-muted-foreground">{selectedBarber.email}</p>
                        <p className="text-sm text-primary">{selectedBarber.specialty || 'Especialidade não informada'}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={
                      selectedBarber.role === 'owner' || selectedBarber.position === 'gerente'
                        ? 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                        : selectedBarber.position === 'administrador'
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                    }>
                      {getBarberIcon(selectedBarber)}
                      <span className="ml-1">{getBarberLabel(selectedBarber)}</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Métricas - Iguais ao Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Faturamento do Barbeiro (igual ao Dashboard do funcionário) */}
                {selectedBarber.position === 'funcionario' ? (
                  <Card className="border-primary bg-gradient-to-br from-primary/10 to-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-primary">Faturamento do Barbeiro</CardTitle>
                      <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">
                        R$ {barberData.faturamentoLiquido.toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {comissaoPercentual}% dos serviços concluídos hoje
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Faturamento Hoje</CardTitle>
                      <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-success">
                        R$ {barberData.faturamentoHoje.toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        apenas serviços concluídos
                      </p>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
                    <Calendar className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{barberData.agendamentosHoje}</div>
                    <p className="text-xs text-muted-foreground">
                      {barberData.agendamentosHoje - barberData.agendamentosConcluidos} pendentes
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Concluídos Hoje</CardTitle>
                    <Clock className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {barberData.agendamentosConcluidos}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      serviços finalizados
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Faturamento Mensal</CardTitle>
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      R$ {barberData.faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      total do mês
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Agendamentos Recentes */}
              <Card>
                <CardHeader>
                  <CardTitle>Agendamentos Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  {barberData.agendamentos.length > 0 ? (
                    <div className="space-y-3">
                      {barberData.agendamentos.map((agendamento) => (
                        <div key={agendamento.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{agendamento.cliente}</p>
                            <p className="text-sm text-muted-foreground">{agendamento.servico}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(agendamento.data).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{agendamento.horario}</span>
                            <span className="font-bold text-success">R$ {agendamento.valor.toFixed(2)}</span>
                            <Badge className={getStatusColor(agendamento.status)}>
                              {getStatusLabel(agendamento.status)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Nenhum agendamento encontrado para este barbeiro
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {!selectedBarberId && (
            <div className="text-center py-8">
              <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Selecione um barbeiro para visualizar seus relatórios em tempo real
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
