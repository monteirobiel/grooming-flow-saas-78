
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Package, Trash2, ShoppingCart } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  produto: any;
  user: any;
  onEditProduct: (product: any) => void;
  onDeleteProduct: (product: any) => void;
  onRestockProduct: (product: any) => void;
  onSellProduct: (produto: any, quantidade: number, dataVenda: Date, horarioVenda: string) => void;
}

export const ProductCard = ({
  produto,
  user,
  onEditProduct,
  onDeleteProduct,
  onRestockProduct,
  onSellProduct
}: ProductCardProps) => {
  const getEstoqueStatus = (estoque: number, minimo: number) => {
    if (estoque <= minimo) {
      return { status: 'baixo', color: 'bg-destructive text-destructive-foreground', label: 'Baixo' };
    } else if (estoque <= minimo * 1.5) {
      return { status: 'alerta', color: 'bg-yellow-500 text-black', label: 'Alerta' };
    }
    return { status: 'ok', color: 'bg-green-500 text-white', label: 'OK' };
  };

  const estoqueInfo = getEstoqueStatus(produto.estoque, produto.estoqueMinimo);
  const margem = user?.role === 'owner' ? ((produto.precoVenda - produto.precoCusto) / produto.precoCusto) * 100 : 0;

  return (
    <Card className="card-elegant hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{produto.nome}</CardTitle>
            <p className="text-sm text-muted-foreground">{produto.categoria}</p>
          </div>
          <Badge className={estoqueInfo.color}>
            {estoqueInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Estoque</p>
            <p className="font-medium">{produto.estoque} unidades</p>
          </div>
          <div>
            <p className="text-muted-foreground">Mín. Estoque</p>
            <p className="font-medium">{produto.estoqueMinimo} unidades</p>
          </div>
        </div>

        {user?.role === 'owner' && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Custo</p>
              <p className="font-medium">R$ {produto.precoCusto.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Venda</p>
              <p className="font-medium text-green-500">R$ {produto.precoVenda.toFixed(2)}</p>
            </div>
          </div>
        )}

        {user?.role === 'owner' && (
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Margem</p>
              <p className="font-medium text-primary">{margem.toFixed(1)}%</p>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Fornecedor: {produto.fornecedor}
          </p>
        </div>

        {user?.role === 'owner' && (
          <div className="flex gap-2 flex-wrap">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => onEditProduct(produto)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Editar
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  size="sm" 
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir o produto "{produto.nome}"?
                    <br />
                    <span className="text-yellow-600 font-medium">
                      Esta ação não pode ser desfeita e todas as vendas relacionadas também serão removidas.
                    </span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDeleteProduct(produto)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Excluir Produto
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {produto.estoque <= produto.estoqueMinimo && (
              <Button 
                size="sm" 
                className="btn-primary"
                onClick={() => onRestockProduct(produto)}
              >
                <Package className="w-4 h-4 mr-1" />
                Repor
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={produto.estoque <= 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Vender
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Vender {produto.nome}</AlertDialogTitle>
                  <AlertDialogDescription>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="quantidade">Quantidade</Label>
                        <Input
                          id="quantidade"
                          type="number"
                          min="1"
                          max={produto.estoque}
                          defaultValue="1"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="dataVenda">Data da Venda</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="dataVenda"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal mt-1",
                                "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              <span id="dataVendaText">Selecionar data</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              onSelect={(date) => {
                                if (date) {
                                  const button = document.getElementById('dataVenda');
                                  const text = document.getElementById('dataVendaText');
                                  if (button && text) {
                                    button.setAttribute('data-selected-date', date.toISOString());
                                    text.textContent = format(date, 'dd/MM/yyyy');
                                    button.classList.remove('text-muted-foreground');
                                  }
                                }
                              }}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label htmlFor="horarioVenda">Horário da Venda</Label>
                        <Input
                          id="horarioVenda"
                          type="time"
                          defaultValue={new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          className="mt-1"
                        />
                      </div>

                      <div className="text-sm border-t pt-3">
                        <p>Estoque disponível: {produto.estoque} unidades</p>
                        <p>Valor unitário: R$ {produto.precoVenda.toFixed(2)}</p>
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={(e) => {
                      const quantidadeInput = document.getElementById('quantidade') as HTMLInputElement;
                      const dataButton = document.getElementById('dataVenda') as HTMLButtonElement;
                      const horarioInput = document.getElementById('horarioVenda') as HTMLInputElement;
                      
                      const quantidade = parseInt(quantidadeInput.value) || 1;
                      const dataVenda = dataButton.getAttribute('data-selected-date') 
                        ? new Date(dataButton.getAttribute('data-selected-date')!) 
                        : new Date();
                      const horarioVenda = horarioInput.value || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                      
                      onSellProduct(produto, quantidade, dataVenda, horarioVenda);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Confirmar Venda
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
