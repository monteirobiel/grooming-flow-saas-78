import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Plus, Search, AlertTriangle, TrendingUp, Edit, Package, Trash2, CalendarIcon, ShoppingCart, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { ProductForm } from "@/components/forms/ProductForm";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface Venda {
  id: number;
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  data: string;
  horario: string;
}

const Products = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [salesFilter, setSalesFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date>();

  // Dados iniciais dos produtos
  const initialProdutos = [
    {
      id: 1,
      nome: "Pomada Modeladora",
      categoria: "Finalizadores",
      estoque: 15,
      estoqueMinimo: 5,
      precoCusto: 12.50,
      precoVenda: 25.00,
      fornecedor: "Distribuidora XYZ"
    },
    {
      id: 2,
      nome: "Shampoo Anticaspa",
      categoria: "Higiene",
      estoque: 3,
      estoqueMinimo: 5,
      precoCusto: 8.00,
      precoVenda: 16.00,
      fornecedor: "Beauty Supply"
    },
    {
      id: 3,
      nome: "Óleo para Barba",
      categoria: "Barba",
      estoque: 22,
      estoqueMinimo: 10,
      precoCusto: 15.00,
      precoVenda: 35.00,
      fornecedor: "Beard Bros"
    },
    {
      id: 4,
      nome: "Cera Modeladora",
      categoria: "Finalizadores",
      estoque: 7,
      estoqueMinimo: 8,
      precoCusto: 10.00,
      precoVenda: 22.00,
      fornecedor: "Style Pro"
    }
  ];

  // Estado dos produtos com persistência
  const [produtos, setProdutos] = useState(() => {
    const savedProdutos = localStorage.getItem('barbershop-produtos');
    if (savedProdutos) {
      return JSON.parse(savedProdutos);
    }
    return initialProdutos;
  });

  // Sistema de vendas real
  const [vendas, setVendas] = useState<Venda[]>(() => {
    const savedVendas = localStorage.getItem('barbershop-vendas');
    if (savedVendas) {
      return JSON.parse(savedVendas);
    }
    return [
      {
        id: 1,
        produtoId: 1,
        produtoNome: "Pomada Modeladora",
        quantidade: 2,
        valorUnitario: 25.00,
        valorTotal: 50.00,
        data: "2024-06-12",
        horario: "09:30"
      },
      {
        id: 2,
        produtoId: 3,
        produtoNome: "Óleo para Barba",
        quantidade: 1,
        valorUnitario: 35.00,
        valorTotal: 35.00,
        data: "2024-06-12",
        horario: "14:15"
      },
      {
        id: 3,
        produtoId: 2,
        produtoNome: "Shampoo Anticaspa",
        quantidade: 3,
        valorUnitario: 16.00,
        valorTotal: 48.00,
        data: "2024-06-11",
        horario: "16:45"
      }
    ];
  });

  // Salvar produtos no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('barbershop-produtos', JSON.stringify(produtos));
  }, [produtos]);

  // Salvar vendas no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('barbershop-vendas', JSON.stringify(vendas));
  }, [vendas]);

  // Função para simular uma venda com quantidade, data e horário personalizados
  const simularVendaComQuantidade = (produto: any, quantidade: number, dataVenda: Date, horarioVenda: string) => {
    if (produto.estoque < quantidade) {
      toast({
        title: "Estoque insuficiente",
        description: `Só há ${produto.estoque} unidades em estoque.`,
        variant: "destructive"
      });
      return false;
    }

    const novaVenda: Venda = {
      id: Date.now(),
      produtoId: produto.id,
      produtoNome: produto.nome,
      quantidade: quantidade,
      valorUnitario: produto.precoVenda,
      valorTotal: produto.precoVenda * quantidade,
      data: dataVenda.toISOString().split('T')[0],
      horario: horarioVenda
    };

    setVendas(prev => [novaVenda, ...prev]);
    
    // Reduzir estoque
    setProdutos(prev => prev.map(p => 
      p.id === produto.id 
        ? { ...p, estoque: p.estoque - quantidade }
        : p
    ));

    toast({
      title: "Venda realizada!",
      description: `${quantidade}x ${produto.nome} vendido(s) por R$ ${novaVenda.valorTotal.toFixed(2)} em ${format(dataVenda, 'dd/MM/yyyy')} às ${horarioVenda}`
    });
    
    return true;
  };

  const getEstoqueStatus = (estoque: number, minimo: number) => {
    if (estoque <= minimo) {
      return { status: 'baixo', color: 'bg-destructive text-destructive-foreground', label: 'Baixo' };
    } else if (estoque <= minimo * 1.5) {
      return { status: 'alerta', color: 'bg-yellow-500 text-black', label: 'Alerta' };
    }
    return { status: 'ok', color: 'bg-green-500 text-white', label: 'OK' };
  };

  const handleSaveProduct = (product: any) => {
    if (editingProduct) {
      setProdutos(prev => prev.map(p => p.id === product.id ? product : p));
      toast({
        title: "Produto atualizado!",
        description: `${product.nome} foi atualizado com sucesso.`
      });
    } else {
      setProdutos(prev => [...prev, product]);
      toast({
        title: "Produto criado!",
        description: `${product.nome} foi adicionado ao estoque.`
      });
    }
    setEditingProduct(null);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = (product: any) => {
    setProdutos(prev => prev.filter(p => p.id !== product.id));
    
    // Remover vendas relacionadas ao produto excluído
    setVendas(prev => prev.filter(v => v.produtoId !== product.id));
    
    toast({
      title: "Produto excluído!",
      description: `${product.nome} foi removido do estoque.`
    });
  };

  const handleRestockProduct = (product: any) => {
    const quantidade = prompt(`Quantas unidades deseja adicionar ao estoque de ${product.nome}?`);
    if (quantidade && !isNaN(parseInt(quantidade))) {
      setProdutos(prev => prev.map(p => 
        p.id === product.id 
          ? { ...p, estoque: p.estoque + parseInt(quantidade) }
          : p
      ));
      
      toast({
        title: "Estoque atualizado!",
        description: `${quantidade} unidades adicionadas ao estoque de ${product.nome}`
      });
    }
  };

  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.fornecedor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || categoryFilter === "all" || produto.categoria === categoryFilter;
    
    let matchesStock = true;
    if (stockFilter === 'baixo') {
      matchesStock = produto.estoque <= produto.estoqueMinimo;
    } else if (stockFilter === 'alerta') {
      matchesStock = produto.estoque > produto.estoqueMinimo && produto.estoque <= produto.estoqueMinimo * 1.5;
    } else if (stockFilter === 'ok') {
      matchesStock = produto.estoque > produto.estoqueMinimo * 1.5;
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const filteredVendas = vendas.filter(venda => {
    const today = new Date().toISOString().split('T')[0];
    const vendasMonth = new Date().getMonth();
    const vendaMonth = new Date(venda.data).getMonth();
    
    if (salesFilter === 'hoje') {
      return venda.data === today;
    } else if (salesFilter === 'mes') {
      return vendaMonth === vendasMonth;
    } else if (dateFilter) {
      return venda.data === format(dateFilter, 'yyyy-MM-dd');
    }
    
    return true;
  });

  // Cálculos das métricas sempre visíveis (zeradas se não houver produtos/vendas)
  const totalEstoque = produtos.reduce((total, produto) => total + (produto.estoque * produto.precoCusto), 0);
  const produtosBaixo = produtos.filter(p => p.estoque <= p.estoqueMinimo).length;
  const totalVendas = filteredVendas.reduce((total, venda) => total + venda.valorTotal, 0);
  const categorias = [...new Set(produtos.map(p => p.categoria))];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie o estoque e vendas dos seus produtos
          </p>
        </div>
        <div className="flex gap-2">
          {user?.role === 'owner' && (
            <Button 
              className="btn-primary"
              onClick={() => {
                setEditingProduct(null);
                setShowProductForm(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          )}
        </div>
      </div>

      {/* Métricas - sempre visíveis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor do Estoque</CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalEstoque.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">custo total</p>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos em Baixa</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{produtosBaixo}</div>
            <p className="text-xs text-muted-foreground">requerem reposição</p>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              R$ {totalVendas.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {salesFilter === 'hoje' ? 'vendas de hoje' : 
               salesFilter === 'mes' ? 'vendas do mês' : 
               dateFilter ? `vendas de ${format(dateFilter, 'dd/MM/yyyy')}` : 'total de vendas'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="card-elegant">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos por nome, categoria ou fornecedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input-elegant"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter || "all"} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categorias.map(categoria => (
                    <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={stockFilter || "all"} onValueChange={setStockFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Estoque" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="baixo">Baixo</SelectItem>
                  <SelectItem value="alerta">Alerta</SelectItem>
                  <SelectItem value="ok">OK</SelectItem>
                </SelectContent>
              </Select>

              <Select value={salesFilter} onValueChange={setSalesFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Vendas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="mes">Este Mês</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-40 justify-start text-left font-normal",
                      !dateFilter && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFilter ? format(dateFilter, "dd/MM/yyyy") : "Filtrar por data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    initialFocus
                    className="pointer-events-auto"
                  />
                  {dateFilter && (
                    <div className="p-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDateFilter(undefined)}
                        className="w-full"
                      >
                        Limpar filtro
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Produtos */}
      {produtos.length === 0 ? (
        <Card className="card-elegant">
          <CardContent className="pt-6 text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Nenhum produto cadastrado</h3>
            <p className="text-muted-foreground mb-4">
              Comece adicionando produtos ao seu estoque.
            </p>
            {user?.role === 'owner' && (
              <Button 
                className="btn-primary"
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Produto
              </Button>
            )}
          </CardContent>
        </Card>
      ) : filteredProdutos.length === 0 ? (
        <Card className="card-elegant">
          <CardContent className="pt-6 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Não há produtos que correspondam aos filtros aplicados.
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("");
                setStockFilter("");
              }}
            >
              Limpar Filtros
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProdutos.map((produto) => {
            const estoqueInfo = getEstoqueStatus(produto.estoque, produto.estoqueMinimo);
            const margem = user?.role === 'owner' ? ((produto.precoVenda - produto.precoCusto) / produto.precoCusto) * 100 : 0;

            return (
              <Card key={produto.id} className="card-elegant hover:shadow-lg transition-all duration-200">
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
                        onClick={() => handleEditProduct(produto)}
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
                              onClick={() => handleDeleteProduct(produto)}
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
                          onClick={() => handleRestockProduct(produto)}
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
                                
                                simularVendaComQuantidade(produto, quantidade, dataVenda, horarioVenda);
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
          })}
        </div>
      )}

      {/* Histórico de Vendas */}
      <Card className="card-elegant">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <CardTitle>Histórico de Vendas</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {filteredVendas.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                {vendas.length === 0 ? 'Nenhuma venda realizada ainda.' : 'Nenhuma venda encontrada para os filtros aplicados.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Valor Unitário</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendas.map((venda) => (
                  <TableRow key={venda.id}>
                    <TableCell>{new Date(venda.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{venda.horario}</TableCell>
                    <TableCell>{venda.produtoNome}</TableCell>
                    <TableCell>{venda.quantidade}</TableCell>
                    <TableCell>R$ {venda.valorUnitario.toFixed(2)}</TableCell>
                    <TableCell className="font-medium text-green-600">
                      R$ {venda.valorTotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <ProductForm
        open={showProductForm}
        onOpenChange={setShowProductForm}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default Products;
