
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ServiceManagement } from "@/components/management/ServiceManagement";
import { CommissionSettings } from "@/components/management/CommissionSettings";

const Management = () => {
  const { user } = useAuth();

  // Apenas donos têm acesso a esta página
  if (user?.role !== 'owner') {
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

  return (
    <div className="space-y-6 animate-fade-in">
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Gestão de Serviços
          </TabsTrigger>
          <TabsTrigger value="commission" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Configuração de Repasse
          </TabsTrigger>
        </TabsList>

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
