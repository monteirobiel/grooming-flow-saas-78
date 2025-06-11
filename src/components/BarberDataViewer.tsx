
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DollarSign, Calendar, Clock, TrendingUp, Eye } from "lucide-react";

interface BarberDataViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barbeiros: any[];
}

export const BarberDataViewer = ({ open, onOpenChange, barbeiros }: BarberDataViewerProps) => {
  const [selectedBarberId, setSelectedBarberId] = useState<string>("");

  // Dados mockados para demonstração
  const getBarberData = (barberId: string) => {
    const barberNames = ["Carlos", "Marcos"];
    const isCarlos = barberId === "1";
    
    return {
      faturamentoHoje: isCarlos ? 180.00 : 120.00,
      faturamentoMes: isCarlos ? 5200.00 : 3800.00,
      agendamentosHoje: isCarlos ? 6 : 4,
      agendamentosConcluidos: isCarlos ? 4 : 3,
      agendamentos: [
        {
          id: 1,
          cliente: isCarlos ? "João Silva" : "Pedro Santos",
          servico: isCarlos ? "Corte + Barba" : "Corte",
          horario: isCarlos ? "09:00" : "10:00",
          valor: isCarlos ? 45.00 : 30.00,
          status: "concluido"
        },
        {
          id: 2,
          cliente: isCarlos ? "Lucas Oliveira" : "Rafael Costa",
          servico: "Barba",
          horario: isCarlos ? "14:00" : "15:00",
          valor: 25.00,
          status: "confirmado"
        }
      ]
    };
  };

  const selectedBarber = barbeiros.find(b => b.id.toString() === selectedBarberId);
  const barberData = selectedBarberId ? getBarberData(selectedBarberId) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-primary text-primary-foreground';
      case 'concluido':
        return 'bg-green-500 text-white';
      case 'pendente':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Visualizar Dados do Barbeiro
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Seletor de Barbeiro */}
          <div>
            <label className="text-sm font-medium mb-2 block">Selecionar Barbeiro</label>
            <Select value={selectedBarberId} onValueChange={setSelectedBarberId}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um barbeiro funcionário" />
              </SelectTrigger>
              <SelectContent>
                {barbeiros
                  .filter(b => b.position === 'funcionario')
                  .map((barbeiro) => (
                    <SelectItem key={barbeiro.id} value={barbeiro.id.toString()}>
                      {barbeiro.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dados do Barbeiro Selecionado */}
          {selectedBarber && barberData && (
            <>
              {/* Header do Barbeiro */}
              <Card className="border-primary">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{selectedBarber.name}</h3>
                      <p className="text-muted-foreground">{selectedBarber.email}</p>
                      <p className="text-sm text-primary">{selectedBarber.specialty}</p>
                    </div>
                    <Badge variant="secondary">Funcionário</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Métricas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Faturamento Hoje</CardTitle>
                    <DollarSign className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success">
                      R$ {barberData.faturamentoHoje.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
                    <Calendar className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{barberData.agendamentosHoje}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
                    <Clock className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {barberData.agendamentosConcluidos}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Faturamento Mensal</CardTitle>
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      R$ {barberData.faturamentoMes.toLocaleString('pt-BR')}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Agendamentos Recentes */}
              <Card>
                <CardHeader>
                  <CardTitle>Agendamentos Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {barberData.agendamentos.map((agendamento) => (
                      <div key={agendamento.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{agendamento.cliente}</p>
                          <p className="text-sm text-muted-foreground">{agendamento.servico}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{agendamento.horario}</span>
                          <span className="font-bold text-success">R$ {agendamento.valor.toFixed(2)}</span>
                          <Badge className={getStatusColor(agendamento.status)}>
                            {agendamento.status === 'concluido' ? 'Concluído' : 'Confirmado'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!selectedBarberId && (
            <div className="text-center py-8">
              <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Selecione um barbeiro para visualizar seus dados
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
