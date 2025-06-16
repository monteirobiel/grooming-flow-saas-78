import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ShoppingBag, TrendingUp, Users, DollarSign, Clock, Crown, User, CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { appointments, loadAppointments } = useAppointments();
  const [isAppointmentsDialogOpen, setIsAppointmentsDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Estado para configuração de comissão
  const [comissaoPercentual, setComissaoPercentual] = useState(15);

  // Carregar produtos do localStorage para verificar estoque baixo
  const [produtos, setProdutos] = useState([]);
  
  useEffect(() => {
    const savedProdutos = localStorage.getItem('barbershop-produtos');
    if (savedProdutos) {
      setProdutos(JSON.parse(savedProdutos));
    }
  }, []);

  // Carregar configuração de comissão do localStorage
  useEffect(() => {
    const savedComissao = localStorage.getItem('barbershop-comissao');
    if (savedComissao) {
      setComissaoPercentual(parseFloat(savedComissao));
    }

    // Listener para atualizações da comissão
    const handleComissaoUpdate = (event: any) => {
      setComissaoPercentual(event.detail.comissao);
    };

    window.addEventListener('comissaoUpdated', handleComissaoUpdate);
    
    return () => {
      window.removeEventListener('comissaoUpdated', handleComissaoUpdate);
    };
  }, []);

  // Escutar mudanças nos agendamentos com múltiplos listeners para garantir sincronização
  useEffect(() => {
    console.log('🔄 Dashboard - configurando múltiplos listeners para sincronização');
    
    const handleAppointmentsUpdate = (event: CustomEvent) => {
      console.log('📨 Dashboard - recebido evento appointmentsUpdated:', event.detail);
      loadAppointments();
    };

    const handleForceReload = () => {
      console.log('🔄 Dashboard - forçando reload');
      loadAppointments();
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'appointments') {
        console.log('💾 Dashboard - detectada mudança no localStorage de appointments');
        loadAppointments();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Dashboard - página ficou visível, recarregando dados');
        loadAppointments();
      }
    };
    
    // Múltiplos listeners para garantir sincronização
    window.addEventListener('appointmentsUpdated', handleAppointmentsUpdate as EventListener);
    window.addEventListener('forceReload', handleForceReload as EventListener);
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Verificar mudanças periodicamente (fallback mais frequente)
    const intervalId = setInterval(() => {
      loadAppointments();
    }, 2000); // Verifica a cada 2 segundos
    
    // Carregar dados imediatamente
    loadAppointments();
    
    return () => {
      console.log('🧹 Dashboard - removendo todos os listeners');
      window.removeEventListener('appointmentsUpdated', handleAppointmentsUpdate as EventListener);
      window.removeEventListener('forceReload', handleForceReload as EventListener);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, [loadAppointments]);

  // Log sempre que appointments mudar no Dashboard
  useEffect(() => {
    console.log('🏠 Dashboard - appointments atualizados:', appointments);
    console.log('🏠 Dashboard - total de appointments:', appointments.length);
  }, [appointments]);

  // Verificar se é barbeiro administrador
  const isBarberAdmin = user?.role === 'barber' && user?.position === 'administrador';
  const isBarberEmployee = user?.role === 'barber' && user?.position === 'funcionario';

  // Filtrar agendamentos baseado no usuário
  const filteredAgendamentos = isBarberEmployee 
    ? appointments.filter(ag => ag.barbeiro === user?.name)
    : appointments;

  console.log('🔍 Dashboard - agendamentos filtrados:', filteredAgendamentos);

  // Função para calcular faturamento baseado APENAS em serviços concluídos
  const calculateRevenueForPeriod = (startDate?: Date, endDate?: Date) => {
    if (!startDate || !endDate) {
      // Se não há período selecionado, usar dados de hoje - APENAS CONCLUÍDOS
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = filteredAgendamentos.filter(ag => ag.data === today);
      const todayCompletedAppointments = todayAppointments.filter(ag => ag.status === 'concluido');
      
      console.log('💰 Calculando faturamento de hoje - apenas concluídos:', todayCompletedAppointments);
      
      const bruto = todayCompletedAppointments.reduce((total, ag) => total + (ag.valor || 0), 0);
      
      // Calcular líquido baseado no tipo de usuário
      let liquido = 0;
      
      if (isBarberEmployee) {
        // Para barbeiros funcionários: apenas o valor de repasse dos SEUS serviços
        liquido = todayCompletedAppointments.reduce((total, ag) => {
          const valor = ag.valor || 0;
          const valorRepasse = valor * comissaoPercentual / 100; // Repasse do funcionário
          console.log(`💼 Repasse do funcionário ${ag.barbeiro}: R$ ${valor} -> R$ ${valorRepasse} (${comissaoPercentual}% repasse)`);
          return total + valorRepasse;
        }, 0);
      } else {
        // Para donos/administradores: valor líquido da barbearia
        liquido = todayCompletedAppointments.reduce((total, ag) => {
          const valor = ag.valor || 0;
          
          // Verificar se o barbeiro do agendamento é "Dono da Barbearia"
          if (ag.barbeiro === 'Dono da Barbearia') {
            console.log(`💼 Serviço do proprietário ${ag.barbeiro}: R$ ${valor} (sem comissão)`);
            return total + valor;
          }
          
          // Para outros barbeiros, aplica a comissão (barbearia fica com a diferença)
          const valorLiquido = valor * (100 - comissaoPercentual) / 100;
          console.log(`🔄 Serviço de ${ag.barbeiro}: R$ ${valor} -> R$ ${valorLiquido} (${comissaoPercentual}% comissão)`);
          return total + valorLiquido;
        }, 0);
      }

      return { bruto, liquido };
    }

    // Filtrar agendamentos do período selecionado - APENAS CONCLUÍDOS
    const periodAppointments = filteredAgendamentos.filter(ag => {
      const appointmentDate = new Date(ag.data);
      return appointmentDate >= startDate && appointmentDate <= endDate;
    });
    
    const periodCompletedAppointments = periodAppointments.filter(ag => ag.status === 'concluido');
    
    console.log('💰 Calculando faturamento do período - apenas concluídos:', periodCompletedAppointments);
    
    const bruto = periodCompletedAppointments.reduce((total, ag) => total + (ag.valor || 0), 0);
    
    // Calcular líquido baseado no tipo de usuário
    let liquido = 0;
    
    if (isBarberEmployee) {
      // Para barbeiros funcionários: apenas o valor de repasse dos SEUS serviços
      liquido = periodCompletedAppointments.reduce((total, ag) => {
        const valor = ag.valor || 0;
        const valorRepasse = valor * comissaoPercentual / 100; // Repasse do funcionário
        console.log(`💼 Repasse do funcionário ${ag.barbeiro}: R$ ${valor} -> R$ ${valorRepasse} (${comissaoPercentual}% repasse)`);
        return total + valorRepasse;
      }, 0);
    } else {
      // Para donos/administradores: valor líquido da barbearia
      liquido = periodCompletedAppointments.reduce((total, ag) => {
        const valor = ag.valor || 0;
        
        // Verificar se o barbeiro do agendamento é "Dono da Barbearia"
        if (ag.barbeiro === 'Dono da Barbearia') {
          console.log(`💼 Serviço do proprietário ${ag.barbeiro}: R$ ${valor} (sem comissão)`);
          return total + valor;
        }
        
        // Para outros barbeiros, aplica a comissão (barbearia fica com a diferença)
        const valorLiquido = valor * (100 - comissaoPercentual) / 100;
        console.log(`🔄 Serviço de ${ag.barbeiro}: R$ ${valor} -> R$ ${valorLiquido} (${comissaoPercentual}% comissão)`);
        return total + valorLiquido;
      }, 0);
    }

    return { bruto, liquido };
  };

  // Calcular métricas baseadas APENAS nos agendamentos concluídos
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = filteredAgendamentos.filter(ag => ag.data === today);
  const todayCompletedAppointments = todayAppointments.filter(ag => ag.status === 'concluido');
  
  const monthlyAppointments = filteredAgendamentos.filter(ag => {
    const appointmentDate = new Date(ag.data);
    const currentDate = new Date();
    return appointmentDate.getMonth() === currentDate.getMonth() && 
           appointmentDate.getFullYear() === currentDate.getFullYear();
  });
  const monthlyCompletedAppointments = monthlyAppointments.filter(ag => ag.status === 'concluido');

  console.log('📅 Dashboard - agendamentos de hoje:', todayAppointments);
  console.log('💰 Dashboard - agendamentos concluídos hoje:', todayCompletedAppointments);
  console.log('📅 Dashboard - agendamentos do mês:', monthlyAppointments);
  console.log('💰 Dashboard - agendamentos concluídos do mês:', monthlyCompletedAppointments);

  const revenueData = calculateRevenueForPeriod(dateRange.from, dateRange.to);

  const dashboardData = {
    faturamentoBruto: revenueData.bruto,
    faturamentoLiquido: revenueData.liquido,
    agendamentosHoje: todayAppointments.length,
    agendamentosPendentes: todayAppointments.filter(ag => ag.status === 'pendente').length
  };

  // Calcular produtos em baixa com base nos dados reais
  const produtosBaixo = produtos.filter((p: any) => p.estoque <= p.estoqueMinimo);

  // Próximos agendamentos (hoje e amanhã) - TODOS os status, não apenas concluídos
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const proximosAgendamentos = filteredAgendamentos.filter(ag => 
    ag.data === today || ag.data === tomorrowStr
  ).map(ag => ({
    ...ag,
    data: ag.data === today ? "Hoje" : "Amanhã"
  }));

  // Próximos agendamentos (apenas hoje) - TODOS os status
  const proximosAgendamentosHoje = proximosAgendamentos.filter(ag => ag.data === "Hoje");

  console.log('⏰ Dashboard - próximos agendamentos (todos os status):', proximosAgendamentos);
  console.log('⏰ Dashboard - agendamentos de hoje (todos os status):', proximosAgendamentosHoje);

  // Serviços mais vendidos baseados APENAS nos dados concluídos
  const serviceCounts = monthlyCompletedAppointments.reduce((acc: any, ag) => {
    if (ag.servico) {
      acc[ag.servico] = (acc[ag.servico] || 0) + 1;
    }
    return acc;
  }, {});

  const serviceRevenue = monthlyCompletedAppointments.reduce((acc: any, ag) => {
    if (ag.servico) {
      acc[ag.servico] = (acc[ag.servico] || 0) + (ag.valor || 0);
    }
    return acc;
  }, {});

  const melhoresServicos = Object.entries(serviceCounts)
    .map(([servico, vendas]) => ({
      servico,
      vendas: vendas as number,
      valor: serviceRevenue[servico] || 0
    }))
    .sort((a, b) => b.vendas - a.vendas)
    .slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Indicador de Permissões */}
      {user?.role === 'barber' && (
        <Card className="card-modern border-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {user.position === 'administrador' ? (
                  <>
                    <Crown className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold text-primary">Barbeiro Administrador</p>
                      <p className="text-sm text-muted-foreground">
                        Acesso completo aos dados da barbearia
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <User className="w-6 h-6 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Barbeiro Funcionário</p>
                      <p className="text-sm text-muted-foreground">
                        Visualizando apenas seus dados pessoais
                      </p>
                    </div>
                  </>
                )}
              </div>
              <Badge 
                variant={user.position === 'administrador' ? 'default' : 'secondary'}
                className={user.position === 'administrador' ? 'badge-premium' : ''}
              >
                {user.position === 'administrador' ? 'Admin' : 'Funcionário'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtro de Data para Faturamento - Apenas para donos e administradores */}
      {!isBarberEmployee && (
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Filtrar por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Selecionar período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={new Date()}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={1}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {dateRange.from && dateRange.to && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setDateRange({ from: undefined, to: undefined })}
                className="mt-2 w-full"
              >
                Limpar Filtro
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Métricas Principais - Diferentes para funcionários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Para funcionários: apenas faturamento líquido (repasse) */}
        {isBarberEmployee ? (
          <>
            {/* Faturamento Líquido (Repasse) - Para Funcionários */}
            <Card className="card-modern border-primary bg-gradient-to-br from-primary/10 to-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary">
                  Meu Repasse
                </CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  R$ {dashboardData.faturamentoLiquido.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {comissaoPercentual}% dos meus serviços concluídos hoje
                </p>
              </CardContent>
            </Card>

            {/* Agendamentos Hoje */}
            <Card className="card-modern">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Meus Agendamentos Hoje
                </CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.agendamentosHoje}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData.agendamentosPendentes} pendentes
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Para donos/administradores: faturamento bruto e líquido */}
            <Card className="card-modern border-primary bg-gradient-to-br from-primary/10 to-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary">
                  Faturamento Bruto
                </CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  R$ {dashboardData.faturamentoBruto.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {dateRange.from && dateRange.to 
                    ? `período selecionado` 
                    : 'apenas serviços concluídos hoje'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Faturamento Líquido
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  R$ {dashboardData.faturamentoLiquido.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {dateRange.from && dateRange.to 
                    ? `período selecionado (${comissaoPercentual}% comissão)` 
                    : `serviços realizados (${comissaoPercentual}% comissão)`
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Agendamentos Hoje
                </CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.agendamentosHoje}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData.agendamentosPendentes} pendentes
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Agendamentos */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {isBarberEmployee ? 'Meus Próximos Agendamentos' : 'Próximos Agendamentos'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {proximosAgendamentosHoje.length > 0 ? (
              <>
                <div className="text-sm text-muted-foreground mb-3">
                  Mostrando {proximosAgendamentosHoje.length} agendamento(s) para hoje
                </div>
                {proximosAgendamentosHoje.map((agendamento) => (
                  <div key={agendamento.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{agendamento.cliente}</p>
                      <p className="text-sm text-muted-foreground">{agendamento.servico}</p>
                      {!isBarberEmployee && (
                        <p className="text-xs text-muted-foreground">com {agendamento.barbeiro}</p>
                      )}
                      <Badge 
                        variant={
                          agendamento.status === 'concluido' ? 'default' : 
                          agendamento.status === 'confirmado' ? 'secondary' : 
                          'outline'
                        }
                        className="mt-1"
                      >
                        {agendamento.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-primary">{agendamento.horario}</span>
                      <p className="text-xs text-muted-foreground">R$ {agendamento.valor?.toFixed(2) || '0,00'}</p>
                    </div>
                  </div>
                ))}
                <Dialog open={isAppointmentsDialogOpen} onOpenChange={setIsAppointmentsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Ver Todos os Agendamentos
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        {isBarberEmployee ? 'Meus Agendamentos' : 'Todos os Agendamentos'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {['Hoje', 'Amanhã'].map((dia) => {
                        const agendamentosDoDia = proximosAgendamentos.filter(ag => ag.data === dia);
                        if (agendamentosDoDia.length === 0) return null;
                        
                        return (
                          <div key={dia} className="space-y-3">
                            <h3 className="font-semibold text-lg text-primary border-b border-border pb-2">
                              {dia}
                            </h3>
                            <div className="grid gap-3">
                              {agendamentosDoDia.map((agendamento) => (
                                <div key={agendamento.id} className="flex items-center justify-between p-4 bg-muted rounded-lg border">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <p className="font-semibold">{agendamento.cliente}</p>
                                      <Badge variant={agendamento.status === 'confirmado' ? 'default' : 'secondary'}>
                                        {agendamento.status}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-1">{agendamento.servico}</p>
                                    {!isBarberEmployee && (
                                      <p className="text-xs text-muted-foreground">Barbeiro: {agendamento.barbeiro}</p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <span className="font-bold text-primary text-lg">{agendamento.horario}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      <div className="flex justify-end pt-4 border-t border-border">
                        <Button onClick={() => navigate('/agendamentos')}>
                          Gerenciar Agendamentos
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Nenhum agendamento para hoje
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Total de agendamentos no sistema: {appointments.length}
                </p>
                <Dialog open={isAppointmentsDialogOpen} onOpenChange={setIsAppointmentsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Ver Todos os Agendamentos
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        {isBarberEmployee ? 'Meus Agendamentos' : 'Todos os Agendamentos'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {proximosAgendamentos.length > 0 ? (
                        ['Hoje', 'Amanhã'].map((dia) => {
                          const agendamentosDoDia = proximosAgendamentos.filter(ag => ag.data === dia);
                          if (agendamentosDoDia.length === 0) return null;
                          
                          return (
                            <div key={dia} className="space-y-3">
                              <h3 className="font-semibold text-lg text-primary border-b border-border pb-2">
                                {dia}
                              </h3>
                              <div className="grid gap-3">
                                {agendamentosDoDia.map((agendamento) => (
                                  <div key={agendamento.id} className="flex items-center justify-between p-4 bg-muted rounded-lg border">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <p className="font-semibold">{agendamento.cliente}</p>
                                        <Badge variant={agendamento.status === 'confirmado' ? 'default' : 'secondary'}>
                                          {agendamento.status}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-1">{agendamento.servico}</p>
                                      {!isBarberEmployee && (
                                        <p className="text-xs text-muted-foreground">Barbeiro: {agendamento.barbeiro}</p>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <span className="font-bold text-primary text-lg">{agendamento.horario}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground mb-4">
                            Nenhum agendamento encontrado
                          </p>
                          <Button onClick={() => navigate('/agendamentos')}>
                            Criar Novo Agendamento
                          </Button>
                        </div>
                      )}
                      <div className="flex justify-end pt-4 border-t border-border">
                        <Button onClick={() => navigate('/agendamentos')}>
                          Gerenciar Agendamentos
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Serviços Mais Vendidos */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {isBarberEmployee ? 'Meus Serviços Mais Vendidos' : 'Serviços Mais Vendidos'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {melhoresServicos.length > 0 ? (
              melhoresServicos.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{item.servico}</p>
                    <p className="text-sm text-muted-foreground">{item.vendas} vendas</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-success">
                      R$ {item.valor.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhum serviço vendido este mês
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Produtos em Baixa - Apenas para donos e barbeiros administradores */}
      {(user?.role === 'owner' || isBarberAdmin) && (
        <Card className="card-modern border-warning">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <ShoppingBag className="h-5 w-5" />
              Produtos em Baixa
            </CardTitle>
          </CardHeader>
          <CardContent>
            {produtosBaixo.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-3">
                  {produtosBaixo.length} produto(s) precisam de reposição:
                </p>
                <div className="space-y-2">
                  {produtosBaixo.slice(0, 3).map((produto: any) => (
                    <div key={produto.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <p className="font-medium text-sm">{produto.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          Estoque: {produto.estoque} / Mínimo: {produto.estoqueMinimo}
                        </p>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        Baixo
                      </Badge>
                    </div>
                  ))}
                  {produtosBaixo.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      e mais {produtosBaixo.length - 3} produto(s)...
                    </p>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/produtos')}
                  className="w-full mt-3"
                >
                  Gerenciar Estoque
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">
                  ✅ Todos os produtos estão com estoque adequado
                </p>
                <p className="text-xs text-muted-foreground">
                  Não há produtos que precisam de reposição
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/produtos')}
                  className="mt-3"
                >
                  Ver Produtos
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
