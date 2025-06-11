
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Users, Bell, Download, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const Settings = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    whatsapp: true,
    email: false,
    push: true
  });

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
        <Card className="card-modern">
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
                defaultValue="Barbearia do João" 
                className="input-modern"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input 
                id="address" 
                defaultValue="Rua das Flores, 123 - Centro" 
                className="input-modern"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone" 
                defaultValue="(11) 99999-9999" 
                className="input-modern"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue="contato@barbearia.com" 
                className="input-modern"
              />
            </div>

            <Button className="btn-primary w-full">
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Horário de Funcionamento */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle>Horário de Funcionamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { dia: 'Segunda-feira', abertura: '08:00', fechamento: '18:00' },
              { dia: 'Terça-feira', abertura: '08:00', fechamento: '18:00' },
              { dia: 'Quarta-feira', abertura: '08:00', fechamento: '18:00' },
              { dia: 'Quinta-feira', abertura: '08:00', fechamento: '18:00' },
              { dia: 'Sexta-feira', abertura: '08:00', fechamento: '18:00' },
              { dia: 'Sábado', abertura: '08:00', fechamento: '16:00' },
              { dia: 'Domingo', abertura: '', fechamento: '' }
            ].map((horario, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium">
                  {horario.dia.slice(0, 3)}
                </div>
                {horario.abertura ? (
                  <>
                    <Input 
                      type="time" 
                      defaultValue={horario.abertura} 
                      className="input-modern flex-1"
                    />
                    <span className="text-muted-foreground">às</span>
                    <Input 
                      type="time" 
                      defaultValue={horario.fechamento} 
                      className="input-modern flex-1"
                    />
                  </>
                ) : (
                  <span className="text-muted-foreground flex-1">Fechado</span>
                )}
              </div>
            ))}
            
            <Button variant="outline" className="w-full">
              Atualizar Horários
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Seção exclusiva para donos */}
      {user?.role === 'owner' && (
        <>
          {/* Gestão de Usuários */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Barbeiros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Carlos Silva</p>
                    <p className="text-sm text-muted-foreground">carlos@barbearia.com</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded">
                      Ativo
                    </span>
                    <Button size="sm" variant="outline">
                      Editar
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Marcos Santos</p>
                    <p className="text-sm text-muted-foreground">marcos@barbearia.com</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded">
                      Ativo
                    </span>
                    <Button size="sm" variant="outline">
                      Editar
                    </Button>
                  </div>
                </div>
                
                <Button className="btn-primary w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Adicionar Barbeiro
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Relatórios e Exportação */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Relatórios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Download className="w-5 h-5" />
                  <span>Relatório Mensal</span>
                  <span className="text-xs text-muted-foreground">PDF</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Download className="w-5 h-5" />
                  <span>Dados Financeiros</span>
                  <span className="text-xs text-muted-foreground">Excel</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Download className="w-5 h-5" />
                  <span>Lista de Clientes</span>
                  <span className="text-xs text-muted-foreground">CSV</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col gap-2">
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
    </div>
  );
};

export default Settings;
