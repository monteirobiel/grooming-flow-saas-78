
import { Calendar, Home, ShoppingBag, Settings, LogOut, Scissors, Crown, TrendingUp, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: TrendingUp,
  },
  {
    title: "Agendamentos",
    url: "/agendamentos",
    icon: Calendar,
  },
  {
    title: "Produtos",
    url: "/produtos",
    icon: ShoppingBag,
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <Sidebar className="border-r border-border bg-card/30 backdrop-blur-sm">
      <SidebarHeader className="border-b border-border p-6 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-elegant rounded-xl flex items-center justify-center shadow-elegant">
            <Scissors className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg text-gradient">BarberPro</h2>
            <div className="flex items-center gap-2 mt-1">
              {user?.role === 'owner' && <Crown className="w-3 h-3 text-primary" />}
              <p className="text-xs text-muted-foreground font-medium">{user?.name}</p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold mb-4 px-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className={`nav-item w-full justify-start text-left transition-all duration-200 ${
                      location.pathname === item.url 
                        ? 'active bg-primary/10 text-primary border-r-2 border-primary' 
                        : 'hover:bg-accent/50 hover:text-primary'
                    }`}
                  >
                    <Link to={item.url} className="flex items-center gap-3 w-full">
                      <item.icon className={`w-5 h-5 nav-icon transition-colors ${
                        location.pathname === item.url ? 'text-primary' : ''
                      }`} />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user?.role === 'owner' && (
          <SidebarGroup className="mt-8">
            <SidebarGroupLabel className="text-primary font-semibold mb-4 px-2 flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Gestão Premium
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                <SidebarMenuItem>
                  <SidebarMenuButton className="nav-item w-full justify-start">
                    <Users className="w-5 h-5 nav-icon" />
                    <span className="font-medium">Barbeiros</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4 bg-gradient-to-r from-destructive/5 to-transparent">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={logout} 
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair do Sistema</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
