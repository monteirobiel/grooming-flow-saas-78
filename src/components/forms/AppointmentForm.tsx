
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

interface AppointmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: any;
  onSave: (appointment: any) => void;
}

export const AppointmentForm = ({ open, onOpenChange, appointment, onSave }: AppointmentFormProps) => {
  const [formData, setFormData] = useState({
    cliente: appointment?.cliente || "",
    telefone: appointment?.telefone || "",
    servico: appointment?.servico || "",
    barbeiro: appointment?.barbeiro || "",
    data: appointment?.data || new Date().toISOString().split('T')[0],
    horario: appointment?.horario || "",
    valor: appointment?.valor || 0
  });

  const servicos = ["Corte", "Barba", "Corte + Barba", "Sobrancelha", "Lavagem"];
  const barbeiros = ["Carlos", "Marcos", "João"];
  const horarios = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cliente || !formData.telefone || !formData.servico || !formData.barbeiro || !formData.horario) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newAppointment = {
      ...formData,
      id: appointment?.id || Date.now(),
      status: appointment?.status || "pendente"
    };

    onSave(newAppointment);
    onOpenChange(false);
    
    toast({
      title: "Sucesso!",
      description: appointment ? "Agendamento atualizado!" : "Agendamento criado!"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Editar Agendamento" : "Novo Agendamento"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="cliente">Cliente *</Label>
            <Input
              id="cliente"
              value={formData.cliente}
              onChange={(e) => setFormData(prev => ({ ...prev, cliente: e.target.value }))}
              className="input-elegant"
              placeholder="Nome do cliente"
            />
          </div>

          <div>
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
              className="input-elegant"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <Label htmlFor="servico">Serviço *</Label>
            <Select 
              value={formData.servico} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, servico: value }))}
            >
              <SelectTrigger className="input-elegant">
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent>
                {servicos.map(servico => (
                  <SelectItem key={servico} value={servico}>{servico}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="barbeiro">Barbeiro *</Label>
            <Select 
              value={formData.barbeiro} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, barbeiro: value }))}
            >
              <SelectTrigger className="input-elegant">
                <SelectValue placeholder="Selecione o barbeiro" />
              </SelectTrigger>
              <SelectContent>
                {barbeiros.map(barbeiro => (
                  <SelectItem key={barbeiro} value={barbeiro}>{barbeiro}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data">Data *</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                className="input-elegant"
              />
            </div>
            
            <div>
              <Label htmlFor="horario">Horário *</Label>
              <Select 
                value={formData.horario} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, horario: value }))}
              >
                <SelectTrigger className="input-elegant">
                  <SelectValue placeholder="Horário" />
                </SelectTrigger>
                <SelectContent>
                  {horarios.map(horario => (
                    <SelectItem key={horario} value={horario}>{horario}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) => setFormData(prev => ({ ...prev, valor: parseFloat(e.target.value) || 0 }))}
              className="input-elegant"
              placeholder="0.00"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="btn-primary flex-1">
              {appointment ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
