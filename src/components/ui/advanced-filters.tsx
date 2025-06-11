
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

export const AdvancedFilters = ({ open, onOpenChange, filters, onFiltersChange, onClearFilters }: FilterProps) => {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const removeFilter = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const activeFiltersCount = Object.keys(filters).filter(key => filters[key] && filters[key] !== '').length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Filtros Avançados
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} filtros ativos</Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Filtros por Status */}
          <div>
            <Label>Status</Label>
            <Select 
              value={filters.status || ""} 
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Barbeiro */}
          <div>
            <Label>Barbeiro</Label>
            <Select 
              value={filters.barbeiro || ""} 
              onValueChange={(value) => handleFilterChange('barbeiro', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os barbeiros" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="Carlos">Carlos</SelectItem>
                <SelectItem value="Marcos">Marcos</SelectItem>
                <SelectItem value="João">João</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Período */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data Inicial</Label>
              <Input
                type="date"
                value={filters.dataInicial || ""}
                onChange={(e) => handleFilterChange('dataInicial', e.target.value)}
                className="input-elegant"
              />
            </div>
            <div>
              <Label>Data Final</Label>
              <Input
                type="date"
                value={filters.dataFinal || ""}
                onChange={(e) => handleFilterChange('dataFinal', e.target.value)}
                className="input-elegant"
              />
            </div>
          </div>

          {/* Filtro por Valor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Valor Mínimo</Label>
              <Input
                type="number"
                step="0.01"
                value={filters.valorMinimo || ""}
                onChange={(e) => handleFilterChange('valorMinimo', e.target.value)}
                className="input-elegant"
                placeholder="0.00"
              />
            </div>
            <div>
              <Label>Valor Máximo</Label>
              <Input
                type="number"
                step="0.01"
                value={filters.valorMaximo || ""}
                onChange={(e) => handleFilterChange('valorMaximo', e.target.value)}
                className="input-elegant"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Filtros Ativos */}
          {activeFiltersCount > 0 && (
            <div>
              <Label>Filtros Ativos</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value || value === '') return null;
                  return (
                    <Badge key={key} variant="outline" className="flex items-center gap-1">
                      {key}: {String(value)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeFilter(key)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClearFilters} className="flex-1">
              Limpar Filtros
            </Button>
            <Button onClick={() => onOpenChange(false)} className="btn-primary flex-1">
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
