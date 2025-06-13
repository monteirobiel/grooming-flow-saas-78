
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp } from "lucide-react";

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

interface SalesHistoryProps {
  filteredVendas: Venda[];
  vendas: Venda[];
}

export const SalesHistory = ({ filteredVendas, vendas }: SalesHistoryProps) => {
  return (
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
  );
};
