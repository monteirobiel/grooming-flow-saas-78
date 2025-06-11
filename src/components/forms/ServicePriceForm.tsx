
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash } from "lucide-react";

interface ServicePriceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ServicePriceForm = ({ open, onOpenChange }: ServicePriceFormProps) => {
  const [servicos, setServicos] = useState([
    { id: 1, nome: "Corte", preco: 30.00 },
    { id: 2, nome: "Barba", preco: 25.00 },
    { id: 3, nome: "Corte + Barba", preco: 45.00 },
    { id: 4, nome: "Sobrancelha", preco: 15.00 },
    { id: 5, nome: "Lavagem", preco: 20.00 }
  ]);

  const [novoServico, setNovoServico] = useState({ nome: "", preco: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAddService = () => {
    if (!novoServico.nome || novoServico.preco <= 0) {
      toast({
        title: "Erro",
        description: "Preencha o nome e o preço do serviço",
        variant: "destructive"
      });
      return;
    }

    if (editingId) {
      setServicos(prev => prev.map(s => 
        s.id === editingId 
          ? { ...s, nome: novoServico.nome, preco: novoServico.preco }
          : s
      ));
      setEditingId(null);
    } else {
      const newService = {
        id: Date.now(),
        nome: novoServico.nome,
        preco: novoServico.preco
      };
      setServicos(prev => [...prev, newService]);
    }

    setNovoServico({ nome: "", preco: 0 });
    toast({
      title: "Sucesso!",
      description: editingId ? "Serviço atualizado!" : "Serviço adicionado!"
    });
  };

  const handleEditService = (servico: any) => {
    setNovoServico({ nome: servico.nome, preco: servico.preco });
    setEditingId(servico.id);
  };

  const handleDeleteService = (id: number) => {
    if (confirm("Tem certeza que deseja remover este serviço?")) {
      setServicos(prev => prev.filter(s => s.id !== id));
      toast({
        title: "Serviço removido",
        description: "O serviço foi removido com sucesso"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Preços dos Serviços</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Formulário para adicionar/editar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {editingId ? "Editar Serviço" : "Adicionar Serviço"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome do Serviço</Label>
                  <Input
                    id="nome"
                    value={novoServico.nome}
                    onChange={(e) => setNovoServico(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Ex: Corte Tradicional"
                  />
                </div>
                <div>
                  <Label htmlFor="preco">Preço (R$)</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    value={novoServico.preco}
                    onChange={(e) => setNovoServico(prev => ({ ...prev, preco: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <Button onClick={handleAddService} className="w-full">
                {editingId ? "Atualizar Serviço" : "Adicionar Serviço"}
              </Button>
              {editingId && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingId(null);
                    setNovoServico({ nome: "", preco: 0 });
                  }}
                  className="w-full"
                >
                  Cancelar Edição
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Lista de serviços */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Serviços Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {servicos.map((servico) => (
                  <div key={servico.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{servico.nome}</p>
                      <p className="text-sm text-success font-bold">R$ {servico.preco.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditService(servico)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteService(servico.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
