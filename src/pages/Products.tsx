
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Plus, Search, AlertTriangle, TrendingUp, Edit, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { ProductForm } from "@/components/forms/ProductForm";
import { toast } from "@/components/ui/use-toast";

const Products = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Dados mockados - em produção viriam de uma API
  const [produtos, setProdutos] = useState([
    {
      id: 1,
      nome: "Pomada Modeladora",
      categoria: "Finalizadores",
      estoque: 15,
      estoqueMinimo: 5,
      precoCusto: 12.50,
      precoVenda: 25.00,
      vendasMes: 8,
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
      vendasMes: 12,
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
      vendasMes: 18,
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
      vendasMes: 6,
      fornecedor: "Style Pro"
    }
  ]);

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
    } else {
      setProdutos(prev => [...prev, product]);
    }
    setEditingProduct(null);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowProductForm(true);
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

  const totalEstoque = produtos.reduce((total, produto) => total + (produto.estoque * produto.precoCusto), 0);
  const produtosBaixo = produtos.filter(p => p.estoque <= p.estoqueMinimo).length;
  const totalVendas = produtos.reduce((total, produto) => total + (produto.vendasMes * produto.precoVenda), 0);
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

      {/* Métricas */}
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
            <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              R$ {totalVendas.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">produtos vendidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="card-elegant">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
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
            <div className="flex gap-2">
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Produtos */}
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

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Vendas/Mês</p>
                    <p className="font-medium">{produto.vendasMes} unidades</p>
                  </div>
                  {user?.role === 'owner' && (
                    <div>
                      <p className="text-muted-foreground">Margem</p>
                      <p className="font-medium text-primary">{margem.toFixed(1)}%</p>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Fornecedor: {produto.fornecedor}
                  </p>
                </div>

                {user?.role === 'owner' && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEditProduct(produto)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    {produto.estoque <= produto.estoqueMinimo && (
                      <Button 
                        size="sm" 
                        className="btn-primary flex-1"
                        onClick={() => handleRestockProduct(produto)}
                      >
                        <Package className="w-4 h-4 mr-1" />
                        Repor
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProdutos.length === 0 && (
        <Card className="card-elegant">
          <CardContent className="pt-6 text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Não há produtos que correspondam aos filtros aplicados.
            </p>
            {user?.role === 'owner' && (
              <Button 
                className="btn-primary"
                onClick={() => setShowProductForm(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Produto
              </Button>
            )}
          </CardContent>
        </Card>
      )}

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
