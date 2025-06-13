
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ProductForm } from "@/components/forms/ProductForm";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ProductMetrics } from "@/components/products/ProductMetrics";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SalesHistory } from "@/components/products/SalesHistory";

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

      {/* Métricas */}
      <ProductMetrics
        totalEstoque={totalEstoque}
        produtosBaixo={produtosBaixo}
        totalVendas={totalVendas}
        salesFilter={salesFilter}
        dateFilter={dateFilter}
      />

      {/* Filtros */}
      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        stockFilter={stockFilter}
        setStockFilter={setStockFilter}
        salesFilter={salesFilter}
        setSalesFilter={setSalesFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        categorias={categorias}
      />

      {/* Lista de Produtos */}
      <ProductGrid
        produtos={produtos}
        filteredProdutos={filteredProdutos}
        user={user}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setCategoryFilter={setCategoryFilter}
        setStockFilter={setStockFilter}
        setEditingProduct={setEditingProduct}
        setShowProductForm={setShowProductForm}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onRestockProduct={handleRestockProduct}
        onSellProduct={simularVendaComQuantidade}
      />

      {/* Histórico de Vendas */}
      <SalesHistory filteredVendas={filteredVendas} vendas={vendas} />

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
