
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useServices } from "@/hooks/useServices";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const ServiceManagement = () => {
  const { services, addService, updateService, deleteService } = useServices();
  const [newService, setNewService] = useState({ nome: "", preco: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<{ id: number; name: string } | null>(null);

  const handleAddService = () => {
    if (!newService.nome.trim() || newService.preco <= 0) {
      toast({
        title: "Erro",
        description: "Preencha o nome e o preço do serviço corretamente",
        variant: "destructive"
      });
      return;
    }

    // Verificar se já existe um serviço com o mesmo nome
    const serviceExists = services.some(s => 
      s.nome.toLowerCase() === newService.nome.toLowerCase() && 
      (editingId === null || s.id !== editingId)
    );

    if (serviceExists) {
      toast({
        title: "Erro",
        description: "Já existe um serviço com este nome",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingId) {
        updateService(editingId, { nome: newService.nome.trim(), preco: newService.preco });
        setEditingId(null);
        toast({
          title: "Sucesso!",
          description: "Serviço atualizado com sucesso!"
        });
      } else {
        addService({ nome: newService.nome.trim(), preco: newService.preco });
        toast({
          title: "Sucesso!",
          description: "Novo serviço adicionado com sucesso!"
        });
      }

      setNewService({ nome: "", preco: 0 });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar o serviço",
        variant: "destructive"
      });
    }
  };

  const handleEditService = (service: any) => {
    setNewService({ nome: service.nome, preco: service.preco });
    setEditingId(service.id);
  };

  const confirmDeleteService = () => {
    if (serviceToDelete) {
      try {
        deleteService(serviceToDelete.id);
        toast({
          title: "Serviço removido",
          description: `O serviço "${serviceToDelete.name}" foi removido com sucesso`
        });
        setServiceToDelete(null);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao remover o serviço",
          variant: "destructive"
        });
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewService({ nome: "", preco: 0 });
  };

  return (
    <div className="space-y-6">
      {/* Formulário para adicionar/editar serviços */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            {editingId ? "Editar Serviço" : "Adicionar Novo Serviço"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service-name">Nome do Serviço</Label>
              <Input
                id="service-name"
                value={newService.nome}
                onChange={(e) => setNewService(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Corte Degradê, Barba Tradicional..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="service-price">Preço (R$)</Label>
              <Input
                id="service-price"
                type="number"
                step="0.01"
                min="0"
                value={newService.preco || ""}
                onChange={(e) => setNewService(prev => ({ ...prev, preco: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleAddService} className="flex-1">
              {editingId ? "Atualizar Serviço" : "Adicionar Serviço"}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={cancelEdit}>
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de serviços cadastrados */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Serviços Cadastrados</span>
            <Badge variant="secondary">{services.length} serviços</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {services.length > 0 ? (
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 bg-muted rounded-lg border">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{service.nome}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <DollarSign className="w-4 h-4 text-success" />
                      <span className="text-success font-bold">R$ {service.preco.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditService(service)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remover
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover o serviço <strong>"{service.nome}"</strong>?
                            <br />
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              setServiceToDelete({ id: service.id, name: service.nome });
                              confirmDeleteService();
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remover Serviço
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Nenhum serviço cadastrado ainda
              </p>
              <p className="text-sm text-muted-foreground">
                Adicione novos serviços usando o formulário acima
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
