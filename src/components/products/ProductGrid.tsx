
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Search } from "lucide-react";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  produtos: any[];
  filteredProdutos: any[];
  user: any;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  setStockFilter: (value: string) => void;
  setEditingProduct: (product: any) => void;
  setShowProductForm: (show: boolean) => void;
  onEditProduct: (product: any) => void;
  onDeleteProduct: (product: any) => void;
  onRestockProduct: (product: any) => void;
  onSellProduct: (produto: any, quantidade: number, dataVenda: Date, horarioVenda: string) => void;
}

export const ProductGrid = ({
  produtos,
  filteredProdutos,
  user,
  searchTerm,
  setSearchTerm,
  setCategoryFilter,
  setStockFilter,
  setEditingProduct,
  setShowProductForm,
  onEditProduct,
  onDeleteProduct,
  onRestockProduct,
  onSellProduct
}: ProductGridProps) => {
  if (produtos.length === 0) {
    return (
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
    );
  }

  if (filteredProdutos.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredProdutos.map((produto) => (
        <ProductCard
          key={produto.id}
          produto={produto}
          user={user}
          onEditProduct={onEditProduct}
          onDeleteProduct={onDeleteProduct}
          onRestockProduct={onRestockProduct}
          onSellProduct={onSellProduct}
        />
      ))}
    </div>
  );
};
