
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Mail } from "lucide-react";

export const ChangeEmailForm = () => {
  const { user } = useAuth();
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [emails, setEmails] = useState({
    current: user?.email || "",
    new: "",
    password: ""
  });

  const handleEmailChange = async () => {
    if (!emails.new || !emails.password) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emails.new)) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email válido",
        variant: "destructive"
      });
      return;
    }

    setIsChangingEmail(true);

    try {
      // Verificar senha atual
      const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const currentUser = storedUsers.find((u: any) => u.id === user?.id);
      
      if (!currentUser || currentUser.password !== emails.password) {
        toast({
          title: "Erro",
          description: "Senha incorreta",
          variant: "destructive"
        });
        setIsChangingEmail(false);
        return;
      }

      // Verificar se o novo email já existe
      const emailExists = storedUsers.some((u: any) => u.email === emails.new && u.id !== user?.id);
      if (emailExists) {
        toast({
          title: "Erro",
          description: "Este email já está sendo usado por outro usuário",
          variant: "destructive"
        });
        setIsChangingEmail(false);
        return;
      }

      // Atualizar email no localStorage
      const updatedUsers = storedUsers.map((u: any) => 
        u.id === user?.id ? { ...u, email: emails.new } : u
      );
      
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

      // Atualizar usuário logado
      const updatedUser = { ...user, email: emails.new };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast({
        title: "Email alterado!",
        description: "Seu email foi alterado com sucesso"
      });

      // Limpar formulário
      setEmails({
        current: emails.new,
        new: "",
        password: ""
      });

      // Recarregar a página para atualizar o contexto
      window.location.reload();

    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar email",
        variant: "destructive"
      });
    } finally {
      setIsChangingEmail(false);
    }
  };

  return (
    <Card className="card-modern">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Alterar Email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-email">Email Atual</Label>
          <Input
            id="current-email"
            type="email"
            value={emails.current}
            disabled
            className="input-elegant bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-email">Novo Email</Label>
          <Input
            id="new-email"
            type="email"
            value={emails.new}
            onChange={(e) => setEmails(prev => ({ ...prev, new: e.target.value }))}
            className="input-elegant"
            placeholder="Digite o novo email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmar com Senha</Label>
          <Input
            id="confirm-password"
            type="password"
            value={emails.password}
            onChange={(e) => setEmails(prev => ({ ...prev, password: e.target.value }))}
            className="input-elegant"
            placeholder="Digite sua senha para confirmar"
          />
        </div>

        <Button 
          className="btn-primary w-full" 
          onClick={handleEmailChange}
          disabled={isChangingEmail}
        >
          {isChangingEmail ? "Alterando..." : "Alterar Email"}
        </Button>
      </CardContent>
    </Card>
  );
};
