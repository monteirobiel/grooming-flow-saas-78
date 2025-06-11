
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Users, Edit, Trash, UserPlus, Crown, User, Eye, BarChart3, Calendar, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { BarberForm } from "@/components/forms/BarberForm";
import { BarberDataViewer } from "@/components/BarberDataViewer";
import { toast } from "@/components/ui/use-toast";

const Barbers = () => {
  const { user } = useAuth();
  const [showBarberForm, setShowBarberForm] = useState(false);
  const [showBarberDataViewer, setShowBarberDataViewer] = useState(false);
  const [editingBarber, setEditingBarber] = useState<any>(null);
  
  const [barbeiros, setBarbeiros] = useState([
    {
      id: 1,
      name: "Carlos Silva",
      email: "carlos@barbearia.com",
      phone: "(11) 99999-9999",
      specialty: "Cortes clássicos",
      position: "administrador",
      status: "active"
    },
    {
      id: 2,
      name: "Marcos Santos",
      email: "marcos@barbearia.com",
      phone: "(11) 88888-8888",
      specialty: "Barbas e bigodes",
      position: "funcionario",
      status: "active"
    }
  ]);

  const handleSaveBarber = (barber: any) => {
    if (editingBarber) {
      setBarbeiros(prev => prev.map(b => b.id === barber.id ? barber : b));
    } else {
      setBarbeiros(prev => [...prev, barber]);
    }
    setEditingBarber(null);
  };

  const handleEditBarber = (barber: any) => {
    setEditingBarber(barber);
    setShowBarberForm(true);
  };

  const handleDeleteBarber = (barberId: number) => {
    if (confirm("Tem certeza que deseja remover este barbeiro?")) {
      setBarbeiros(prev => prev.filter(b => b.id !== barberId));
      toast({
        title: "Barbeiro removido",
        description: "O barbeiro foi removido com sucesso"
      });
    }
  };

  const handleToggleBarberStatus = (barberId: number) => {
    setBarbeiros(prev => prev.map(b => 
      b.id === barberId 
        ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' }
        : b
    ));
  };

  // Verificar se o usuário tem permissão para acessar esta página
  if (user?.role !== 'owner') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Crown className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
          <p className="text-muted-foreground">
            Esta página é exclusiva para proprietários da barbearia.
          </p>
        </div>
      </div>
    );
  }

  const funcionarios = barbeiros.filter(b => b.position === 'funcionario');
  const administradores = barbeiros.filter(b => b.position === 'administrador');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Gestão de Barbeiros
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie sua equipe e monitore o desempenho de cada profissional
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => setShowBarberDataViewer(true)}
            className="hover:bg-primary/10"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Relatórios
          </Button>
          <Button 
            className="btn-primary"
            onClick={() => {
              setEditingBarber(null);
              setShowBarberForm(true);
            }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Adicionar Barbeiro
          </Button>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{barbeiros.length}</p>
                <p className="text-sm text-muted-foreground">Total de Barbeiros</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{administradores.length}</p>
                <p className="text-sm text-muted-foreground">Administradores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{funcionarios.length}</p>
                <p className="text-sm text-muted-foreground">Funcionários</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{barbeiros.filter(b => b.status === 'active').length}</p>
                <p className="text-sm text-muted-foreground">Ativos Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Barbeiros */}
      <Card className="card-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Equipe de Barbeiros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Administradores */}
            {administradores.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-primary" />
                  Administradores
                </h3>
                <div className="grid gap-4">
                  {administradores.map((barbeiro) => (
                    <div key={barbeiro.id} className="bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-lg border border-primary/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Crown className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{barbeiro.name}</h4>
                            <p className="text-sm text-muted-foreground">{barbeiro.email}</p>
                            <p className="text-sm text-muted-foreground">{barbeiro.phone}</p>
                            {barbeiro.specialty && (
                              <p className="text-xs text-primary font-medium">{barbeiro.specialty}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            <Crown className="w-3 h-3 mr-1" />
                            Administrador
                          </Badge>
                          <Switch
                            checked={barbeiro.status === 'active'}
                            onCheckedChange={() => handleToggleBarberStatus(barbeiro.id)}
                          />
                          <span className={`text-xs px-2 py-1 rounded ${
                            barbeiro.status === 'active' 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-500 text-white'
                          }`}>
                            {barbeiro.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                          <Button size="sm" variant="outline" onClick={() => handleEditBarber(barbeiro)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteBarber(barbeiro.id)}>
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Funcionários */}
            {funcionarios.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Funcionários
                </h3>
                <div className="grid gap-4">
                  {funcionarios.map((barbeiro) => (
                    <div key={barbeiro.id} className="bg-gradient-to-r from-blue-500/5 to-transparent p-6 rounded-lg border border-blue-500/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{barbeiro.name}</h4>
                            <p className="text-sm text-muted-foreground">{barbeiro.email}</p>
                            <p className="text-sm text-muted-foreground">{barbeiro.phone}</p>
                            {barbeiro.specialty && (
                              <p className="text-xs text-blue-600 font-medium">{barbeiro.specialty}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                            <User className="w-3 h-3 mr-1" />
                            Funcionário
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setShowBarberDataViewer(true)}
                            className="hover:bg-primary/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Switch
                            checked={barbeiro.status === 'active'}
                            onCheckedChange={() => handleToggleBarberStatus(barbeiro.id)}
                          />
                          <span className={`text-xs px-2 py-1 rounded ${
                            barbeiro.status === 'active' 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-500 text-white'
                          }`}>
                            {barbeiro.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                          <Button size="sm" variant="outline" onClick={() => handleEditBarber(barbeiro)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteBarber(barbeiro.id)}>
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {barbeiros.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum barbeiro cadastrado</h3>
                <p className="text-muted-foreground mb-6">Comece adicionando o primeiro barbeiro da sua equipe</p>
                <Button 
                  className="btn-primary"
                  onClick={() => setShowBarberForm(true)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Barbeiro
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <BarberForm
        open={showBarberForm}
        onOpenChange={setShowBarberForm}
        barber={editingBarber}
        onSave={handleSaveBarber}
      />

      <BarberDataViewer
        open={showBarberDataViewer}
        onOpenChange={setShowBarberDataViewer}
        barbeiros={barbeiros}
      />
    </div>
  );
};

export default Barbers;
