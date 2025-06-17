import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, Filter, Search, Edit, Check, X, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { AdvancedFilters } from "@/components/ui/advanced-filters";
import { toast } from "@/components/ui/use-toast";
import { useAppointments } from "@/hooks/useAppointments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Appointments = () => {
  const { user } = useAuth();
  const { appointments, updateAppointmentStatus, deleteAppointment } = useAppointments();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [filters, setFilters] = useState<any>({});
  const [activeTab, setActiveTab] = useState("todos");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-500 text-white';
      case 'concluido':
        return 'bg-blue-500 text-white';
      case 'pendente':
        return 'bg-yellow-500 text-black';
      case 'cancelado':
        return 'bg-destructive text-destructive-foreground';
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
        return status;
    }
  };

  const handleSaveAppointment = (appointment: any) => {
    setEditingAppointment(null);
  };

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment);
    setShowAppointmentForm(true);
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    updateAppointmentStatus(id, newStatus);
    
    toast({
      title: "Status atualizado!",
      description: `Agendamento ${newStatus}`
    });
  };

  const handleDeleteAppointment = (id: number) => {
    deleteAppointment(id);
    
    toast({
      title: "Agendamento excluído!",
      description: "O agendamento foi removido da lista"
    });
  };

  const applyFilters = (agendamentos: any[]) => {
    const today = new Date().toISOString().split('T')[0];
    
    return agendamentos.filter(agendamento => {
      const matchesSearch = agendamento.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           agendamento.telefone.includes(searchTerm);
      const matchesBarber = user?.role === 'barber' ? agendamento.barbeiro === user.name : true;
      
      // Filtros avançados
      if (filters.status && agendamento.status !== filters.status) return false;
      if (filters.barbeiro && agendamento.barbeiro !== filters.barbeiro) return false;
      if (filters.dataInicial && agendamento.data < filters.dataInicial) return false;
      if (filters.dataFinal && agendamento.data > filters.dataFinal) return false;
      if (filters.valorMinimo && agendamento.valor < parseFloat(filters.valorMinimo)) return false;
      if (filters.valorMaximo && agendamento.valor > parseFloat(filters.valorMaximo)) return false;
      
      // Filtro por abas
      if (activeTab === "proximos") {
        return agendamento.data >= today && (agendamento.status === 'pendente' || agendamento.status === 'confirmado');
      } else if (activeTab === "finalizados") {
        return agendamento.status === 'concluido' || agendamento.status === 'cancelado';
      }
      
      // "todos" - mostra todos os agendamentos
      return matchesSearch && matchesBarber;
    });
  };

  const filteredAgendamentos = applyFilters(appointments).sort((a, b) => {
    return b.id - a.id;
  });

  const activeFiltersCount = Object.keys(filters).filter(key => filters[key] && filters[key] !== '').length;

  const getTabStats = () => {
    const today = new Date().toISOString().split('T')[0];
    
    if (activeTab === "proximos") {
      const proximos = appointments.filter(ag => 
        ag.data >= today && (ag.status === 'pendente' || ag.status === 'confirmado')
      );
      return {
        total: proximos.length,
        faturamento: 0,
        pendentes: proximos.filter(ag => ag.status === 'pendente').length
      };
    } else if (activeTab === "finalizados") {
      const finalizados = appointments.filter(ag => 
        ag.status === 'concluido' || ag.status === 'cancelado'
      );
      return {
        total: finalizados.length,
        faturamento: finalizados.filter(ag => ag.status === 'concluido').reduce((total, ag) => total + ag.valor, 0),
        pendentes: 0
      };
    } else {
      return {
        total: appointments.length,
        faturamento: appointments.filter(ag => ag.status === 'concluido').reduce((total, ag) => total + ag.valor, 0),
        pendentes: appointments.filter(ag => ag.status === 'pendente').length
      };
    }
  };

  const stats = getTabStats();

  const renderAppointmentCard = (agendamento: any) => (
    <Card key={agendamento.id} className="card-elegant hover:shadow-lg transition-all duration-200">
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Informações do Cliente */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{agendamento.cliente}</h3>
            <p className="text-sm text-muted-foreground">{agendamento.telefone}</p>
            <p className="text-xs text-muted-foreground">{agendamento.data}</p>
          </div>
          
          {/* Serviço e Barbeiro */}
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{agendamento.servico}</p>
            <p className="text-sm text-muted-foreground">com {agendamento.barbeiro}</p>
          </div>
          
          {/* Horário e Status */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{agendamento.horario}</span>
            </div>
            <Badge className={getStatusColor(agendamento.status)}>
              {getStatusLabel(agendamento.status)}
            </Badge>
          </div>
          
          {/* Valor */}
          <div className="text-right">
            <span className="font-bold text-primary text-lg">
              R$ {agendamento.valor.toFixed(2)}
            </span>
          </div>
          
          {/* Botões de Ação */}
          <div className="flex flex-wrap gap-2 justify-end">
            {agendamento.status === 'pendente' && (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleStatusChange(agendamento.id, 'confirmado')}
                  className="flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Confirmar</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEditAppointment(agendamento)}
                  className="flex items-center gap-1"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Editar</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleStatusChange(agendamento.id, 'cancelado')}
                  className="flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Cancelar</span>
                </Button>
              </>
            )}
            
            {agendamento.status === 'confirmado' && (
              <Button 
                size="sm" 
                className="btn-primary flex items-center gap-1"
                onClick={() => handleStatusChange(agendamento.id, 'concluido')}
              >
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Concluir Serviço</span>
              </Button>
            )}
            
            {agendamento.status === 'concluido' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleEditAppointment(agendamento)}
                className="flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Ver Detalhes</span>
              </Button>
            )}
            
            {agendamento.status === 'cancelado' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleEditAppointment(agendamento)}
                className="flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Ver Detalhes</span>
              </Button>
            )}
            
            {/* Botão Excluir - apenas para status 'confirmado' e 'pendente' */}
            {(agendamento.status === 'confirmado' || agendamento.status === 'pendente') && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex items-center gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Excluir</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Agendamento</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir o agendamento de {agendamento.cliente}? 
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleDeleteAppointment(agendamento.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Agendamentos</h1>
          <p className="text-muted-foreground">
            Gerencie os agendamentos da sua barbearia
          </p>
        </div>
        <Button 
          className="btn-primary"
          onClick={() => {
            setEditingAppointment(null);
            setShowAppointmentForm(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Filtros */}
      <Card className="card-elegant">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input-elegant"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(true)}
                className="relative"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Abas Elegantes - Aplicando o mesmo design da gestão */}
      <Card className="card-elegant">
        <CardContent className="p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-elegant opacity-5 rounded-2xl"></div>
              <TabsList className="relative grid w-full grid-cols-3 gap-4 p-4 bg-gradient-to-br from-card/80 to-accent/30 border border-primary/20 rounded-2xl shadow-elegant backdrop-blur-sm">
                <TabsTrigger 
                  value="todos" 
                  className="relative flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 data-[state=active]:bg-gradient-elegant data-[state=active]:text-primary-foreground data-[state=active]:shadow-elegant-lg data-[state=active]:scale-105 hover:scale-[1.02] hover:bg-accent/50 border border-transparent data-[state=active]:border-primary/30"
                >
                  <Calendar className="w-6 h-6" />
                  <span>Todos</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="proximos" 
                  className="relative flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 data-[state=active]:bg-gradient-elegant data-[state=active]:text-primary-foreground data-[state=active]:shadow-elegant-lg data-[state=active]:scale-105 hover:scale-[1.02] hover:bg-accent/50 border border-transparent data-[state=active]:border-primary/30"
                >
                  <Clock className="w-6 h-6" />
                  <span>Próximos</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="finalizados" 
                  className="relative flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 data-[state=active]:bg-gradient-elegant data-[state=active]:text-primary-foreground data-[state=active]:shadow-elegant-lg data-[state=active]:scale-105 hover:scale-[1.02] hover:bg-accent/50 border border-transparent data-[state=active]:border-primary/30"
                >
                  <Check className="w-6 h-6" />
                  <span>Finalizados</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Resumo baseado na aba */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="card-modern">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total</CardTitle>
                  <Calendar className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">agendamentos</p>
                </CardContent>
              </Card>

              <Card className="card-modern">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
                  <Clock className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    R$ {stats.faturamento.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activeTab === "finalizados" ? "realizado" : "estimado"}
                  </p>
                </CardContent>
              </Card>

              <Card className="card-modern">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                  <Clock className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">
                    {stats.pendentes}
                  </div>
                  <p className="text-xs text-muted-foreground">confirmações</p>
                </CardContent>
              </Card>
            </div>

            <TabsContent value="todos" className="space-y-4 mt-6">
              <div className="space-y-4">
                {filteredAgendamentos.map(renderAppointmentCard)}
              </div>
            </TabsContent>

            <TabsContent value="proximos" className="space-y-4 mt-6">
              <div className="space-y-4">
                {filteredAgendamentos.map(renderAppointmentCard)}
              </div>
            </TabsContent>

            <TabsContent value="finalizados" className="space-y-4 mt-6">
              <div className="space-y-4">
                {filteredAgendamentos.map(renderAppointmentCard)}
              </div>
            </TabsContent>

            {/* Mensagem quando não há agendamentos */}
            {filteredAgendamentos.length === 0 && (
              <Card className="card-elegant mt-6">
                <CardContent className="pt-6 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Nenhum agendamento encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Não há agendamentos para os filtros aplicados.
                  </p>
                  <Button 
                    className="btn-primary"
                    onClick={() => setShowAppointmentForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Agendamento
                  </Button>
                </CardContent>
              </Card>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Modals */}
      <AppointmentForm
        open={showAppointmentForm}
        onOpenChange={setShowAppointmentForm}
        appointment={editingAppointment}
        onSave={handleSaveAppointment}
      />

      <AdvancedFilters
        open={showFilters}
        onOpenChange={setShowFilters}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={() => setFilters({})}
      />
    </div>
  );
};

export default Appointments;
