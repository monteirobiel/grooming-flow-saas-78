
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ShoppingBag, TrendingUp, Users, DollarSign, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  // Dados mockados - substituir por dados reais da API
  const dashboardData = {
    faturamentoHoje: 450.00,
    faturamentoMes: 12800.00,
    agendamentosHoje: 8,
    agendamentosPendentes: 3,
    produtosVendidos: 15,
    estoqueAlerta: 4,
  };

  const agendamentosProximos = [
    { id: 1, cliente: "João Silva", servico: "Corte + Barba", horario: "14:30", barbeiro: "Carlos" },
    { id: 2, cliente: "Pedro Santos", servico: "Corte", horario: "15:00", barbeiro: "Marcos" },
    { id: 3, cliente: "Lucas Oliveira", servico: "Barba", horario: "15:30", barbeiro: "Carlos" },
  ];

  const melhoresServicos = [
    { servico: "Corte + Barba", vendas: 45, valor: 2250.00 },
    { servico: "Corte Tradicional", vendas: 38, valor: 1140.00 },
    { servico: "Barba", vendas: 22, valor: 660.00 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {dashboardData.faturamentoHoje.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% em relação a ontem
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.agendamentosHoje}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.agendamentosPendentes} pendentes
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {dashboardData.faturamentoMes.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              +8% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Agendamentos */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Próximos Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {agendamentosProximos.map((agendamento) => (
              <div key={agendamento.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{agendamento.cliente}</p>
                  <p className="text-sm text-muted-foreground">{agendamento.servico}</p>
                  <p className="text-xs text-muted-foreground">com {agendamento.barbeiro}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-primary">{agendamento.horario}</span>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Ver Todos os Agendamentos
            </Button>
          </CardContent>
        </Card>

        {/* Serviços Mais Vendidos */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Serviços Mais Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {melhoresServicos.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{item.servico}</p>
                  <p className="text-sm text-muted-foreground">{item.vendas} vendas</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-success">
                    R$ {item.valor.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Notificações */}
      {user?.role === 'owner' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="card-modern border-warning">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <ShoppingBag className="h-5 w-5" />
                Produtos em Baixa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {dashboardData.estoqueAlerta} produtos precisam de reposição
              </p>
              <Button variant="outline" size="sm">
                Gerenciar Estoque
              </Button>
            </CardContent>
          </Card>

          <Card className="card-modern border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Users className="h-5 w-5" />
                Relatório Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Seu relatório semanal está pronto para visualização
              </p>
              <Button variant="outline" size="sm">
                Ver Relatório
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
