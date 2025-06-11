
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Users, Edit, Trash, UserPlus, Crown, User, Eye } from "lucide-react";
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Gestão de Barbeiros</h1>
        <p className="text-muted-foreground">
          Gerencie a equipe da sua barbearia
        </p>
      </div>

      {/* Gestão de Barbeiros */}
      <Card className="card-elegant">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Barbeiros
            </div>
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
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {barbeiros.map((barbeiro) => (
              <div key={barbeiro.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium">{barbeiro.name}</p>
                    <Badge 
                      variant={barbeiro.position === 'administrador' ? 'default' : 'secondary'}
                      className={barbeiro.position === 'administrador' ? 'badge-premium' : ''}
                    >
                      {barbeiro.position === 'administrador' ? (
                        <div className="flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          Administrador
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Funcionário
                        </div>
                      )}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{barbeiro.email}</p>
                  <p className="text-sm text-muted-foreground">{barbeiro.phone}</p>
                  {barbeiro.specialty && (
                    <p className="text-xs text-primary">{barbeiro.specialty}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
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
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditBarber(barbeiro)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeleteBarber(barbeiro.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {barbeiros.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Nenhum barbeiro cadastrado</p>
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

      {/* Gestão Premium - Visualização de Dados */}
      <Card className="card-elegant border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Crown className="h-5 w-5" />
            Gestão Premium
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-primary/10 rounded-lg">
            <h4 className="font-medium mb-2">Visualizar Dados dos Barbeiros</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Como administrador, você pode visualizar os agendamentos e faturamento 
              individual de cada barbeiro funcionário.
            </p>
            <Button 
              className="btn-primary"
              onClick={() => setShowBarberDataViewer(true)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Visualizar Dados dos Barbeiros
            </Button>
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
