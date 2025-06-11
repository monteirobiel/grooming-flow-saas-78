import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Users, Bell, Download, Shield, Edit, Trash, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { BarberForm } from "@/components/forms/BarberForm";
import { toast } from "@/components/ui/use-toast";

const Settings = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    whatsapp: true,
    email: false,
    push: true
  });
  
  const [showBarberForm, setShowBarberForm] = useState(false);
  const [editingBarber, setEditingBarber] = useState<any>(null);
  
  const [barbeiros, setBarbeiros] = useState([
    {
      id: 1,
      name: "Carlos Silva",
      email: "carlos@barbearia.com",
      phone: "(11) 99999-9999",
      specialty: "Cortes clássicos",
      status: "active"
    },
    {
      id: 2,
      name: "Marcos Santos",
      email: "marcos@barbearia.com",
      phone: "(11) 88888-8888",
      specialty: "Barbas e bigodes",
      status: "active"
    }
  ]);

  const [barbeariaData, setBarbeariaData] = useState({
    nome: "Barbearia do João",
    endereco: "Rua das Flores, 123 - Centro",
    telefone: "(11) 99999-9999",
    email: "contato@barbearia.com"
  });

  const [horarios, setHorarios] = useState([
    { dia: 'Segunda-feira', abertura: '08:00', fechamento: '18:00' },
    { dia: 'Terça-feira', abertura: '08:00', fechamento: '18:00' },
    { dia: 'Quarta-feira', abertura: '08:00', fechamento: '18:00' },
    { dia: 'Quinta-feira', abertura: '08:00', fechamento: '18:00' },
    { dia: 'Sexta-feira', abertura: '08:00', fechamento: '18:00' },
    { dia: 'Sábado', abertura: '08:00', fechamento: '16:00' },
    { dia: 'Domingo', abertura: '', fechamento: '' }
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

  const handleSaveBarbeariaData = () => {
    toast({
      title: "Dados salvos!",
      description: "Os dados da barbearia foram atualizados"
    });
  };

  const handleSaveHorarios = () => {
    toast({
      title: "Horários atualizados!",
      description: "Os horários de funcionamento foram salvos"
    });
  };

  const handleExportReport = (type: string) => {
    toast({
      title: "Relatório exportado!",
      description: `O relatório ${type} foi baixado com sucesso`
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua barbearia
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Perfil da Barbearia */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-primary" />
              Dados da Barbearia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Barbearia</Label>
              <Input 
                id="name" 
                value={barbeariaData.nome}
                onChange={(e) => setBarbeariaData(prev => ({ ...prev, nome: e.target.value }))}
                className="input-elegant"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input 
                id="address" 
                value={barbeariaData.endereco}
                onChange={(e) => setBarbeariaData(prev => ({ ...prev, endereco: e.target.value }))}
                className="input-elegant"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone" 
                value={barbeariaData.telefone}
                onChange={(e) => setBarbeariaData(prev => ({ ...prev, telefone: e.target.value }))}
                className="input-elegant"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                value={barbeariaData.email}
                onChange={(e) => setBarbeariaData(prev => ({ ...prev, email: e.target.value }))}
                className="input-elegant"
              />
            </div>

            <Button className="btn-primary w-full" onClick={handleSaveBarbeariaData}>
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Horário de Funcionamento */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Horário de Funcionamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {horarios.map((horario, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium">
                  {horario.dia.slice(0, 3)}
                </div>
                {horario.abertura ? (
                  <>
                    <Input 
                      type="time" 
                      value={horario.abertura}
                      onChange={(e) => setHorarios(prev => prev.map((h, i) => 
                        i === index ? { ...h, abertura: e.target.value } : h
                      ))}
                      className="input-elegant flex-1"
                    />
                    <span className="text-muted-foreground">às</span>
                    <Input 
                      type="time" 
                      value={horario.fechamento}
                      onChange={(e) => setHorarios(prev => prev.map((h, i) => 
                        i === index ? { ...h, fechamento: e.target.value } : h
                      ))}
                      className="input-elegant flex-1"
                    />
                  </>
                ) : (
                  <span className="text-muted-foreground flex-1">Fechado</span>
                )}
              </div>
            ))}
            
            <Button variant="outline" className="w-full" onClick={handleSaveHorarios}>
              Atualizar Horários
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Seção exclusiva para donos */}
      {user?.role === 'owner' && (
        <>
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
                    <div>
                      <p className="font-medium">{barbeiro.name}</p>
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

          {/* Relatórios e Exportação */}
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Relatórios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => handleExportReport('mensal')}
                >
                  <Download className="w-5 h-5" />
                  <span>Relatório Mensal</span>
                  <span className="text-xs text-muted-foreground">PDF</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => handleExportReport('financeiro')}
                >
                  <Download className="w-5 h-5" />
                  <span>Dados Financeiros</span>
                  <span className="text-xs text-muted-foreground">Excel</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => handleExportReport('clientes')}
                >
                  <Download className="w-5 h-5" />
                  <span>Lista de Clientes</span>
                  <span className="text-xs text-muted-foreground">CSV</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => handleExportReport('estoque')}
                >
                  <Download className="w-5 h-5" />
                  <span>Controle de Estoque</span>
                  <span className="text-xs text-muted-foreground">PDF</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Notificações */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">WhatsApp</p>
              <p className="text-sm text-muted-foreground">
                Receber lembretes de agendamentos
              </p>
            </div>
            <Switch 
              checked={notifications.whatsapp}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, whatsapp: checked }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">E-mail</p>
              <p className="text-sm text-muted-foreground">
                Relatórios e resumos por e-mail
              </p>
            </div>
            <Switch 
              checked={notifications.email}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, email: checked }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push</p>
              <p className="text-sm text-muted-foreground">
                Notificações no navegador
              </p>
            </div>
            <Switch 
              checked={notifications.push}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, push: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            Alterar Senha
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            Ativar Autenticação em Duas Etapas
          </Button>
          
          <Button variant="outline" className="w-full justify-start text-destructive">
            Encerrar Todas as Sessões
          </Button>
        </CardContent>
      </Card>

      {/* Feedback */}
      <Card className="card-modern border-primary">
        <CardHeader>
          <CardTitle className="text-primary">Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Encontrou algum bug ou tem sugestões de melhoria? 
            Queremos ouvir sua opinião!
          </p>
          <Button variant="outline" className="w-full">
            Reportar Bug / Sugestão
          </Button>
        </CardContent>
      </Card>

      {/* Modal */}
      <BarberForm
        open={showBarberForm}
        onOpenChange={setShowBarberForm}
        barber={editingBarber}
        onSave={handleSaveBarber}
      />
    </div>
  );
};

export default Settings;
