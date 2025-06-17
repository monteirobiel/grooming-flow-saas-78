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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <Card className="w-full max-w-md bg-card shadow-2xl rounded-xl border border-border/50 backdrop-blur-sm">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="w-20 h-20 bg-gradient-elegant rounded-2xl flex items-center justify-center mx-auto shadow-elegant transform transition-transform duration-300 hover:scale-105">
            <Scissors className="w-10 h-10 text-primary-foreground drop-shadow-sm" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-foreground tracking-tight">
              BarberPro
            </CardTitle>
            <p className="text-muted-foreground text-base font-medium">
              Gerencie sua barbearia com facilidade
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-lg border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-lg border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200 p-1 rounded-md hover:bg-accent/50"
                >
                  {showPassword ? 
                    <EyeOff className="w-5 h-5" /> : 
                    <Eye className="w-5 h-5" />
                  }
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-elegant hover:shadow-elegant-lg font-semibold text-base rounded-lg transition-all duration-300 hover:scale-[1.02] hover:bg-primary/90 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
          
          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground font-medium">
              Primeira vez? Entre em contato com o administrador
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-8 p-5 bg-accent/30 rounded-xl border border-primary/10 backdrop-blur-sm shadow-sm">
            <p className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              Credenciais de Demonstração
            </p>
            <div className="text-xs space-y-2">
              <div className="bg-background/50 p-3 rounded-lg border border-border/30">
                <p className="text-muted-foreground">
                  <span className="font-semibold text-primary">Dono:</span> dono@barbearia.com / 123456
                </p>
                <p className="text-muted-foreground/80 text-xs mt-1">
                  Acesso completo ao sistema
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/20">
              <p className="text-xs text-muted-foreground/80 leading-relaxed">
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
