
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, User, Settings as SettingsIcon, Palette } from "lucide-react";
import { ChangePasswordForm } from "@/components/forms/ChangePasswordForm";
import { ChangeEmailForm } from "@/components/forms/ChangeEmailForm";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Gerencie suas preferências e configurações do sistema</p>
        </div>
      </div>

      {/* Informações do Usuário */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Informações do Usuário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome</label>
              <p className="text-lg font-medium">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-lg font-medium">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Cargo</label>
              <p className="text-lg font-medium">
                {user?.role === 'owner' ? 'Proprietário' : 'Barbeiro'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID</label>
              <p className="text-sm text-muted-foreground font-mono">{user?.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Segurança */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Segurança</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChangeEmailForm />
          <ChangePasswordForm />
        </div>
      </div>

      <Separator />

      {/* Preferências do Sistema */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Preferências do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Tema</h3>
                <p className="text-sm text-muted-foreground">
                  O sistema utiliza tema escuro elegante para uma melhor experiência
                </p>
              </div>
              <div className="text-sm text-primary font-medium">
                Tema Escuro Ativo
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Notificações</h3>
                <p className="text-sm text-muted-foreground">
                  Receba notificações sobre agendamentos e atualizações
                </p>
              </div>
              <div className="text-sm text-primary font-medium">
                Habilitadas
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
