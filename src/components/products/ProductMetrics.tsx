
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, AlertTriangle, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface ProductMetricsProps {
  totalEstoque: number;
  produtosBaixo: number;
  totalVendas: number;
  salesFilter: string;
  dateFilter: Date | undefined;
}

export const ProductMetrics = ({
  totalEstoque,
  produtosBaixo,
  totalVendas,
  salesFilter,
  dateFilter
}: ProductMetricsProps) => {
  return (
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
  );
};
