
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: any;
  onSave: (product: any) => void;
}

export const ProductForm = ({ open, onOpenChange, product, onSave }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    nome: product?.nome || "",
    categoria: product?.categoria || "",
    estoque: product?.estoque || 0,
    estoqueMinimo: product?.estoqueMinimo || 5,
    precoCusto: product?.precoCusto || 0,
    precoVenda: product?.precoVenda || 0,
    fornecedor: product?.fornecedor || ""
  });

  const categorias = ["Finalizadores", "Higiene", "Barba", "Cabelo", "Ferramentas"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.categoria) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newProduct = {
      ...formData,
      id: product?.id || Date.now(),
      vendasMes: product?.vendasMes || 0
    };

    onSave(newProduct);
    onOpenChange(false);
    
    toast({
      title: "Sucesso!",
      description: product ? "Produto atualizado!" : "Produto criado!"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {product ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome do Produto *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              className="input-elegant"
              placeholder="Ex: Pomada Modeladora"
            />
          </div>

          <div>
            <Label htmlFor="categoria">Categoria *</Label>
            <Select 
              value={formData.categoria} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}
            >
              <SelectTrigger className="input-elegant">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map(categoria => (
                  <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estoque">Estoque Atual</Label>
              <Input
                id="estoque"
                type="number"
                value={formData.estoque}
                onChange={(e) => setFormData(prev => ({ ...prev, estoque: parseInt(e.target.value) || 0 }))}
                className="input-elegant"
              />
            </div>
            
            <div>
              <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
              <Input
                id="estoqueMinimo"
                type="number"
                value={formData.estoqueMinimo}
                onChange={(e) => setFormData(prev => ({ ...prev, estoqueMinimo: parseInt(e.target.value) || 0 }))}
                className="input-elegant"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="precoCusto">Preço de Custo (R$)</Label>
              <Input
                id="precoCusto"
                type="number"
                step="0.01"
                value={formData.precoCusto}
                onChange={(e) => setFormData(prev => ({ ...prev, precoCusto: parseFloat(e.target.value) || 0 }))}
                className="input-elegant"
              />
            </div>
            
            <div>
              <Label htmlFor="precoVenda">Preço de Venda (R$)</Label>
              <Input
                id="precoVenda"
                type="number"
                step="0.01"
                value={formData.precoVenda}
                onChange={(e) => setFormData(prev => ({ ...prev, precoVenda: parseFloat(e.target.value) || 0 }))}
                className="input-elegant"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="fornecedor">Fornecedor</Label>
            <Input
              id="fornecedor"
              value={formData.fornecedor}
              onChange={(e) => setFormData(prev => ({ ...prev, fornecedor: e.target.value }))}
              className="input-elegant"
              placeholder="Nome do fornecedor"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="btn-primary flex-1">
              {product ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
