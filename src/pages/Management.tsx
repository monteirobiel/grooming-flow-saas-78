
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ServiceManagement } from "@/components/management/ServiceManagement";
import { CommissionSettings } from "@/components/management/CommissionSettings";

const Management = () => {
  const { user } = useAuth();

  console.log('🏗️ Management - renderizando página de gestão');
  console.log('👤 Management - usuário logado:', user);

  // Apenas donos têm acesso a esta página
  if (user?.role !== 'owner') {
    console.log('❌ Management - acesso negado para usuário:', user?.role);
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
            <p className="text-muted-foreground">
              Esta página é restrita apenas para proprietários da barbearia.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log('✅ Management - acesso liberado para owner');

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-gradient">Gestão da Barbearia</h1>
          <p className="text-muted-foreground">
            Configure serviços e comissões da sua barbearia
          </p>
        </div>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-2xl grid-cols-2 h-14 p-1 bg-card border border-border shadow-elegant rounded-xl">
            <TabsTrigger 
              value="services" 
              className="flex items-center gap-3 text-base font-semibold py-3 px-6 rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-elegant data-[state=active]:text-primary-foreground data-[state=active]:shadow-elegant hover:bg-accent/50 hover:text-primary"
            >
              <Settings className="w-5 h-5" />
              Gestão de Serviços
            </TabsTrigger>
            <TabsTrigger 
              value="commission" 
              className="flex items-center gap-3 text-base font-semibold py-3 px-6 rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-elegant data-[state=active]:text-primary-foreground data-[state=active]:shadow-elegant hover:bg-accent/50 hover:text-primary"
            >
              <DollarSign className="w-5 h-5" />
              Configuração de Repasse
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="services">
          <ServiceManagement />
        </TabsContent>

        <TabsContent value="commission">
          <CommissionSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Management;
