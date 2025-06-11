
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Crown, User } from "lucide-react";

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <SidebarTrigger className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors" />
        <div className="space-y-1">
          <h1 className="font-bold text-xl text-gradient glow-text">
            Barbearia {user?.name}
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-accent/30 rounded-lg border border-border">
          <div className="w-8 h-8 bg-gradient-elegant rounded-full flex items-center justify-center">
            {user?.role === 'owner' ? (
              <Crown className="w-4 h-4 text-primary-foreground" />
            ) : (
              <User className="w-4 h-4 text-primary-foreground" />
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground">
              {user?.role === 'owner' ? 'Proprietário' : 'Barbeiro'}
            </p>
          </div>
        </div>
        
        <Badge 
          variant={user?.role === 'owner' ? 'default' : 'secondary'}
          className={user?.role === 'owner' ? 'badge-premium' : 'bg-accent text-accent-foreground border-border'}
        >
          {user?.role === 'owner' ? (
            <div className="flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Dono
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              Barbeiro
            </div>
          )}
        </Badge>
      </div>
    </header>
  );
};
