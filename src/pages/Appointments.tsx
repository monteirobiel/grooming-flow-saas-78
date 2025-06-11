import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, Filter, Search, Edit, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { AdvancedFilters } from "@/components/ui/advanced-filters";
import { toast } from "@/components/ui/use-toast";

const Appointments = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [filters, setFilters] = useState<any>({});
  const [agendamentos, setAgendamentos] = useState<any[]>([]);

  // Carregar agendamentos do localStorage
  useEffect(() => {
    const storedAppointments = localStorage.getItem('appointments');
    if (storedAppointments) {
      setAgendamentos(JSON.parse(storedAppointments));
    }
  }, []);

  // Salvar agendamentos no localStorage
  const saveAppointments = (appointments: any[]) => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
    setAgendamentos(appointments);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-primary text-primary-foreground';
      case 'concluido':
        return 'bg-green-500 text-white';
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
    let updatedAppointments;
    
    if (editingAppointment) {
      updatedAppointments = agendamentos.map(ag => ag.id === appointment.id ? appointment : ag);
    } else {
      updatedAppointments = [...agendamentos, appointment];
    }
    
    saveAppointments(updatedAppointments);
    setEditingAppointment(null);
  };

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment);
    setShowAppointmentForm(true);
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    const updatedAppointments = agendamentos.map(ag => 
      ag.id === id ? { ...ag, status: newStatus } : ag
    );
    saveAppointments(updatedAppointments);
    
    toast({
      title: "Status atualizado!",
      description: `Agendamento ${newStatus}`
    });
  };

  const applyFilters = (agendamentos: any[]) => {
    return agendamentos.filter(agendamento => {
      const matchesSearch = agendamento.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           agendamento.telefone.includes(searchTerm);
      const matchesDate = agendamento.data === selectedDate;
      const matchesBarber = user?.role === 'barber' ? agendamento.barbeiro === user.name : true;
      
      // Filtros avançados
      if (filters.status && agendamento.status !== filters.status) return false;
      if (filters.barbeiro && agendamento.barbeiro !== filters.barbeiro) return false;
      if (filters.dataInicial && agendamento.data < filters.dataInicial) return false;
      if (filters.dataFinal && agendamento.data > filters.dataFinal) return false;
      if (filters.valorMinimo && agendamento.valor < parseFloat(filters.valorMinimo)) return false;
      if (filters.valorMaximo && agendamento.valor > parseFloat(filters.valorMaximo)) return false;
      
      return matchesSearch && matchesDate && matchesBarber;
    });
  };

  const filteredAgendamentos = applyFilters(agendamentos);
  const activeFiltersCount = Object.keys(filters).filter(key => filters[key] && filters[key] !== '').length;

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
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-elegant"
              />
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

      {/* Resumo do Dia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total do Dia</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAgendamentos.length}</div>
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
              R$ {filteredAgendamentos.reduce((total, ag) => total + ag.valor, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">estimado</p>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {filteredAgendamentos.filter(ag => ag.status === 'pendente').length}
            </div>
            <p className="text-xs text-muted-foreground">confirmações</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Agendamentos */}
      <div className="space-y-4">
        {filteredAgendamentos.map((agendamento) => (
          <Card key={agendamento.id} className="card-elegant hover:shadow-lg transition-all duration-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <h3 className="font-semibold">{agendamento.cliente}</h3>
                  <p className="text-sm text-muted-foreground">{agendamento.telefone}</p>
                </div>
                
                <div>
                  <p className="font-medium">{agendamento.servico}</p>
                  <p className="text-sm text-muted-foreground">com {agendamento.barbeiro}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{agendamento.horario}</span>
                  <Badge className={getStatusColor(agendamento.status)}>
                    {getStatusLabel(agendamento.status)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">
                    R$ {agendamento.valor.toFixed(2)}
                  </span>
                  <div className="flex gap-2">
                    {agendamento.status === 'pendente' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusChange(agendamento.id, 'confirmado')}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Confirmar
                      </Button>
                    )}
                    {agendamento.status === 'confirmado' && (
                      <Button 
                        size="sm" 
                        className="btn-primary"
                        onClick={() => handleStatusChange(agendamento.id, 'concluido')}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Concluir
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditAppointment(agendamento)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    {agendamento.status !== 'cancelado' && agendamento.status !== 'concluido' && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleStatusChange(agendamento.id, 'cancelado')}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAgendamentos.length === 0 && (
          <Card className="card-elegant">
            <CardContent className="pt-6 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Nenhum agendamento encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Não há agendamentos para a data selecionada ou filtros aplicados.
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
      </div>

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
