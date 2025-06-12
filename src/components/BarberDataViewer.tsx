
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DollarSign, Calendar, Clock, TrendingUp, Eye } from "lucide-react";

interface BarberDataViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barbeiros: any[];
}

export const BarberDataViewer = ({ open, onOpenChange, barbeiros }: BarberDataViewerProps) => {
  const [selectedBarberId, setSelectedBarberId] = useState<string>("");

  // Buscar dados reais do barbeiro do localStorage
  const getBarberRealData = (barberId: string) => {
    try {
      // Buscar agendamentos do localStorage
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      
      // Filtrar agendamentos do barbeiro específico
      const barberAppointments = appointments.filter((apt: any) => apt.barberId === barberId);
      
      // Data atual
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      
      // Início do mês atual
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      // Agendamentos de hoje
      const todayAppointments = barberAppointments.filter((apt: any) => 
        apt.date === todayString
      );
      
      // Agendamentos concluídos de hoje
      const todayCompletedAppointments = todayAppointments.filter((apt: any) => 
        apt.status === 'completed'
      );
      
      // Agendamentos do mês atual
      const currentMonthAppointments = barberAppointments.filter((apt: any) => {
        const aptDate = new Date(apt.date);
        return aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear;
      });
      
      // Agendamentos concluídos do mês atual
      const currentMonthCompletedAppointments = currentMonthAppointments.filter((apt: any) => 
        apt.status === 'completed'
      );
      
      // Calcular faturamento
      const calculateRevenue = (appointments: any[]) => {
        return appointments.reduce((total, apt) => {
          if (apt.status === 'completed' && apt.price) {
            return total + parseFloat(apt.price);
          }
          return total;
        }, 0);
      };
      
      const todayRevenue = calculateRevenue(todayCompletedAppointments);
      const monthRevenue = calculateRevenue(currentMonthCompletedAppointments);
      
      // Agendamentos recentes (últimos 5)
      const recentAppointments = barberAppointments
        .sort((a: any, b: any) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime())
        .slice(0, 5)
        .map((apt: any) => ({
          id: apt.id,
          cliente: apt.clientName || 'Cliente não informado',
          servico: apt.service || 'Serviço não informado',
          horario: apt.time || '00:00',
          valor: parseFloat(apt.price) || 0,
          status: apt.status || 'pending'
        }));
      
      return {
        faturamentoHoje: todayRevenue,
        faturamentoMes: monthRevenue,
        agendamentosHoje: todayAppointments.length,
        agendamentosConcluidos: todayCompletedAppointments.length,
        agendamentos: recentAppointments
      };
    } catch (error) {
      console.error('Erro ao buscar dados do barbeiro:', error);
      // Retornar dados zerados em caso de erro
      return {
        faturamentoHoje: 0,
        faturamentoMes: 0,
        agendamentosHoje: 0,
        agendamentosConcluidos: 0,
        agendamentos: []
      };
    }
  };

  const selectedBarber = barbeiros.find(b => b.id.toString() === selectedBarberId);
  const barberData = selectedBarberId ? getBarberRealData(selectedBarberId) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-primary text-primary-foreground';
      case 'completed':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-black';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Visualizar Dados do Barbeiro
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Seletor de Barbeiro */}
          <div>
            <label className="text-sm font-medium mb-2 block">Selecionar Barbeiro</label>
            <Select value={selectedBarberId} onValueChange={setSelectedBarberId}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um barbeiro funcionário" />
              </SelectTrigger>
              <SelectContent>
                {barbeiros
                  .filter(b => b.position === 'funcionario')
                  .map((barbeiro) => (
                    <SelectItem key={barbeiro.id} value={barbeiro.id.toString()}>
                      {barbeiro.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dados do Barbeiro Selecionado */}
          {selectedBarber && barberData && (
            <>
              {/* Header do Barbeiro */}
              <Card className="border-primary">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{selectedBarber.name}</h3>
                      <p className="text-muted-foreground">{selectedBarber.email}</p>
                      <p className="text-sm text-primary">{selectedBarber.specialty || 'Especialidade não informada'}</p>
                    </div>
                    <Badge variant="secondary">Funcionário</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Métricas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Faturamento Hoje</CardTitle>
                    <DollarSign className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success">
                      R$ {barberData.faturamentoHoje.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
                    <Calendar className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{barberData.agendamentosHoje}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
                    <Clock className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {barberData.agendamentosConcluidos}
                    </div>
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
                Selecione um barbeiro para visualizar seus dados
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
