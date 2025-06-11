
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

interface BarberFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barber?: any;
  onSave: (barber: any) => void;
}

export const BarberForm = ({ open, onOpenChange, barber, onSave }: BarberFormProps) => {
  const [formData, setFormData] = useState({
    name: barber?.name || "",
    email: barber?.email || "",
    phone: barber?.phone || "",
    specialty: barber?.specialty || "",
    position: barber?.position || "funcionario"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Erro",
        description: "Nome e e-mail são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newBarber = {
      ...formData,
      id: barber?.id || Date.now(),
      role: 'barber',
      status: barber?.status || 'active'
    };

    onSave(newBarber);
    onOpenChange(false);
    
    toast({
      title: "Sucesso!",
      description: barber ? "Barbeiro atualizado!" : "Barbeiro adicionado!"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {barber ? "Editar Barbeiro" : "Novo Barbeiro"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="input-elegant"
              placeholder="Nome completo"
            />
          </div>

          <div>
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="input-elegant"
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="input-elegant"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <Label htmlFor="specialty">Especialidade</Label>
            <Input
              id="specialty"
              value={formData.specialty}
              onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
              className="input-elegant"
              placeholder="Ex: Cortes modernos, Barbas"
            />
          </div>

          <div>
            <Label htmlFor="position">Cargo/Função</Label>
            <Select value={formData.position} onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}>
              <SelectTrigger className="input-elegant">
                <SelectValue placeholder="Selecione o cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="funcionario">Barbeiro Funcionário</SelectItem>
                <SelectItem value="administrador">Barbeiro Administrador</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {formData.position === 'administrador' 
                ? 'Acesso completo a relatórios e dados de toda a barbearia'
                : 'Acesso apenas aos próprios dados e relatórios'
              }
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="btn-primary flex-1">
              {barber ? "Atualizar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
