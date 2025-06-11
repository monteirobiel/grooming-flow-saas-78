
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Sucesso!",
        description: "Login realizado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "E-mail ou senha incorretos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-muted p-4">
      <Card className="w-full max-w-md card-modern">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto">
            <Scissors className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">BarberPro</CardTitle>
            <p className="text-muted-foreground">
              Gerencie sua barbearia com facilidade
            </p>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-modern"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-modern pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="btn-primary w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Primeira vez? Entre em contato com o administrador
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Credenciais de Demonstração:</p>
            <div className="text-xs space-y-1">
              <p><strong>Dono:</strong> dono@barbearia.com / 123456</p>
              <p className="text-muted-foreground">Acesso completo ao sistema</p>
            </div>
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Para criar novos barbeiros, faça login como dono e acesse a aba "Barbeiros"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
