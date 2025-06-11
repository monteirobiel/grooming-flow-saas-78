
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <div>
          <h1 className="font-semibold text-lg">Barbearia do {user?.name}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Badge variant={user?.role === 'owner' ? 'default' : 'secondary'}>
          {user?.role === 'owner' ? 'Dono' : 'Barbeiro'}
        </Badge>
      </div>
    </header>
  );
};
