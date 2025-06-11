
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ShoppingBag, TrendingUp, Users, DollarSign, Clock, Crown, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Verificar se é barbeiro administrador
  const isBarberAdmin = user?.role === 'barber' && user?.position === 'administrador';
  const isBarberEmployee = user?.role === 'barber' && user?.position === 'funcionario';

  // Dados mockados - substituir por dados reais da API
  const dashboardData = {
    faturamentoHoje: isBarberEmployee ? 180.00 : 450.00,
    faturamentoMes: isBarberEmployee ? 5200.00 : 12800.00,
    agendamentosHoje: isBarberEmployee ? 3 : 8,
    agendamentosPendentes: isBarberEmployee ? 1 : 3,
    produtosVendidos: 15,
    estoqueAlerta: 4,
  };

  // Dados reais de agendamentos - em produção viria da mesma fonte dos agendamentos
  const agendamentosReais = [
    { id: 1, cliente: "João Silva", servico: "Corte + Barba", horario: "14:30", barbeiro: "Carlos" },
    { id: 2, cliente: "Pedro Santos", servico: "Corte", horario: "15:00", barbeiro: "Marcos" },
    { id: 3, cliente: "Lucas Oliveira", servico: "Barba", horario: "15:30", barbeiro: "Carlos" },
  ];

  // Filtrar agendamentos para barbeiro funcionário (apenas os seus)
  const agendamentosDisplay = isBarberEmployee 
    ? agendamentosReais.filter(ag => ag.barbeiro === user?.name)
    : agendamentosReais;

  const melhoresServicos = [
    { servico: "Corte + Barba", vendas: isBarberEmployee ? 15 : 45, valor: isBarberEmployee ? 750.00 : 2250.00 },
    { servico: "Corte Tradicional", vendas: isBarberEmployee ? 12 : 38, valor: isBarberEmployee ? 360.00 : 1140.00 },
    { servico: "Barba", vendas: isBarberEmployee ? 8 : 22, valor: isBarberEmployee ? 240.00 : 660.00 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Indicador de Permissões */}
      {user?.role === 'barber' && (
        <Card className="card-modern border-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {user.position === 'administrador' ? (
                  <>
                    <Crown className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold text-primary">Barbeiro Administrador</p>
                      <p className="text-sm text-muted-foreground">
                        Acesso completo aos dados da barbearia
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <User className="w-6 h-6 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Barbeiro Funcionário</p>
                      <p className="text-sm text-muted-foreground">
                        Visualizando apenas seus dados pessoais
                      </p>
                    </div>
                  </>
                )}
              </div>
              <Badge 
                variant={user.position === 'administrador' ? 'default' : 'secondary'}
                className={user.position === 'administrador' ? 'badge-premium' : ''}
              >
                {user.position === 'administrador' ? 'Admin' : 'Funcionário'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isBarberEmployee ? 'Meu Faturamento Hoje' : 'Faturamento Hoje'}
            </CardTitle>
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
            <CardTitle className="text-sm font-medium">
              {isBarberEmployee ? 'Meus Agendamentos Hoje' : 'Agendamentos Hoje'}
            </CardTitle>
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
            <CardTitle className="text-sm font-medium">
              {isBarberEmployee ? 'Meu Faturamento Mensal' : 'Faturamento Mensal'}
            </CardTitle>
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
              {isBarberEmployee ? 'Meus Próximos Agendamentos' : 'Próximos Agendamentos'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {agendamentosDisplay.length > 0 ? (
              <>
                {agendamentosDisplay.map((agendamento) => (
                  <div key={agendamento.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{agendamento.cliente}</p>
                      <p className="text-sm text-muted-foreground">{agendamento.servico}</p>
                      {!isBarberEmployee && (
                        <p className="text-xs text-muted-foreground">com {agendamento.barbeiro}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-primary">{agendamento.horario}</span>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/agendamentos')}
                >
                  Ver Todos os Agendamentos
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Nenhum agendamento próximo encontrado
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/agendamentos')}
                >
                  Ver Todos os Agendamentos
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Serviços Mais Vendidos */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {isBarberEmployee ? 'Meus Serviços Mais Vendidos' : 'Serviços Mais Vendidos'}
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

      {/* Alertas e Notificações - Apenas para donos e barbeiros administradores */}
      {(user?.role === 'owner' || isBarberAdmin) && (
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/produtos')}
              >
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
                {user?.role === 'owner' ? 'Seu' : 'O'} relatório semanal está pronto para visualização
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
