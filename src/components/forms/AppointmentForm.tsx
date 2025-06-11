
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { useServices } from "@/hooks/useServices";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface AppointmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: any;
  onSave: (appointment: any) => void;
}

export const AppointmentForm = ({ open, onOpenChange, appointment, onSave }: AppointmentFormProps) => {
  const { getServicePrice, getServiceNames } = useServices();
  const [selectedDate, setSelectedDate] = useState<Date>();
  
  const [formData, setFormData] = useState({
    cliente: appointment?.cliente || "",
    telefone: appointment?.telefone || "",
    servico: appointment?.servico || "",
    barbeiro: appointment?.barbeiro || "",
    data: appointment?.data || new Date().toISOString().split('T')[0],
    horario: appointment?.horario || "",
    valor: appointment?.valor || 0
  });

  const servicos = getServiceNames();
  const barbeiros = ["Carlos", "Marcos", "João"];
  
  // Horários baseados na configuração da barbearia
  const getAvailableHorarios = () => {
    if (!selectedDate) return [];
    
    const dayOfWeek = selectedDate.getDay();
    
    // Domingo (0) - fechado
    if (dayOfWeek === 0) return [];
    
    // Sábado (6) - até 16:00
    if (dayOfWeek === 6) {
      return [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
        "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"
      ];
    }
    
    // Segunda a sexta - até 18:00
    return [
      "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
      "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
      "16:00", "16:30", "17:00", "17:30"
    ];
  };

  const horarios = getAvailableHorarios();

  // Atualizar preço quando serviço for selecionado
  const handleServiceChange = (servico: string) => {
    const preco = getServicePrice(servico);
    setFormData(prev => ({ 
      ...prev, 
      servico, 
      valor: preco 
    }));
  };

  // Verificar se a data é válida para agendamento
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Não permitir datas passadas
    if (date < today) return true;
    
    // Não permitir domingos (dia 0)
    if (date.getDay() === 0) return true;
    
    return false;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setFormData(prev => ({ 
        ...prev, 
        data: format(date, 'yyyy-MM-dd'),
        horario: "" // Reset horário quando data muda
      }));
    }
  };

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
              onValueChange={handleServiceChange}
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
              <Label>Data *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal input-elegant",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={isDateDisabled}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="horario">Horário *</Label>
              <Select 
                value={formData.horario} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, horario: value }))}
                disabled={!selectedDate}
              >
                <SelectTrigger className="input-elegant">
                  <SelectValue placeholder={selectedDate ? "Horário" : "Selecione a data"} />
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
              readOnly
              className="input-elegant bg-muted cursor-not-allowed"
              placeholder="Será preenchido automaticamente"
            />
            <p className="text-xs text-muted-foreground mt-1">
              O valor é definido automaticamente baseado no serviço selecionado
            </p>
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
