
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, DollarSign, List } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const ServiceManagement = () => {
  const { services, addService, updateService, deleteService } = useServices();
  const [newService, setNewService] = useState({ nome: "", preco: 0 });
  const [serviceToEdit, setServiceToEdit] = useState<{ id: number; nome: string; preco: number } | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [servicesListOpen, setServicesListOpen] = useState(false);

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
      s.nome.toLowerCase() === newService.nome.toLowerCase()
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
      addService({ nome: newService.nome.trim(), preco: newService.preco });
      toast({
        title: "Sucesso!",
        description: "Novo serviço adicionado com sucesso!"
      });
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
    setServiceToEdit({ id: service.id, nome: service.nome, preco: service.preco });
    setEditDialogOpen(true);
  };

  const confirmEditService = () => {
    if (serviceToEdit) {
      if (!serviceToEdit.nome.trim() || serviceToEdit.preco <= 0) {
        toast({
          title: "Erro",
          description: "Preencha o nome e o preço do serviço corretamente",
          variant: "destructive"
        });
        return;
      }

      // Verificar se já existe um serviço com o mesmo nome (exceto o próprio)
      const serviceExists = services.some(s => 
        s.nome.toLowerCase() === serviceToEdit.nome.toLowerCase() && 
        s.id !== serviceToEdit.id
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
        updateService(serviceToEdit.id, { nome: serviceToEdit.nome.trim(), preco: serviceToEdit.preco });
        toast({
          title: "Sucesso!",
          description: "Serviço atualizado com sucesso!"
        });
        setEditDialogOpen(false);
        setServiceToEdit(null);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao atualizar o serviço",
          variant: "destructive"
        });
      }
    }
  };

  const confirmDeleteService = (serviceId: number, serviceName: string) => {
    try {
      deleteService(serviceId);
      toast({
        title: "Serviço removido",
        description: `O serviço "${serviceName}" foi removido com sucesso`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover o serviço",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulário para adicionar serviços */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Adicionar Novo Serviço
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
          
          <Button onClick={handleAddService} className="w-full">
            Adicionar Serviço
          </Button>
        </CardContent>
      </Card>

      {/* Botão para visualizar serviços cadastrados */}
      <Card className="card-modern border-primary/20 bg-gradient-to-br from-card to-accent">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-gradient">Serviços Cadastrados</span>
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 font-bold text-lg px-3 py-1">
              {services.length} serviços
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Dialog open={servicesListOpen} onOpenChange={setServicesListOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg"
                  className="btn-primary min-w-[280px] h-14 text-lg font-bold shadow-elegant-lg hover:shadow-elegant transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  disabled={services.length === 0}
                >
                  <List className="w-6 h-6 mr-3" />
                  Visualizar Serviços Cadastrados
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Serviços Cadastrados</DialogTitle>
                  <DialogDescription>
                    Gerencie todos os serviços da sua barbearia
                  </DialogDescription>
                </DialogHeader>
                
                {services.length > 0 ? (
                  <div className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome do Serviço</TableHead>
                          <TableHead>Preço</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {services.map((service) => (
                          <TableRow key={service.id}>
                            <TableCell className="font-medium">{service.nome}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4 text-success" />
                                <span className="text-success font-bold">R$ {service.preco.toFixed(2)}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
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
                                        onClick={() => confirmDeleteService(service.id, service.nome)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Remover Serviço
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
              </DialogContent>
            </Dialog>
            
            {services.length === 0 && (
              <div className="mt-6 p-6 bg-muted/50 rounded-lg border border-dashed border-border">
                <Plus className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-2 font-medium text-lg">
                  Nenhum serviço cadastrado ainda
                </p>
                <p className="text-sm text-muted-foreground">
                  Adicione novos serviços usando o formulário acima para começar
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal para editar serviços */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Serviço</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias no serviço selecionado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-service-name">Nome do Serviço</Label>
              <Input
                id="edit-service-name"
                value={serviceToEdit?.nome || ""}
                onChange={(e) => setServiceToEdit(prev => 
                  prev ? { ...prev, nome: e.target.value } : null
                )}
                placeholder="Nome do serviço"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-service-price">Preço (R$)</Label>
              <Input
                id="edit-service-price"
                type="number"
                step="0.01"
                min="0"
                value={serviceToEdit?.preco || ""}
                onChange={(e) => setServiceToEdit(prev => 
                  prev ? { ...prev, preco: parseFloat(e.target.value) || 0 } : null
                )}
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmEditService}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
