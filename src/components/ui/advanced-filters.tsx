
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { X, CalendarIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FilterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

export const AdvancedFilters = ({ open, onOpenChange, filters, onFiltersChange, onClearFilters }: FilterProps) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    // Convert "all" back to empty string for filtering logic
    const filterValue = value === "all" ? "" : value;
    onFiltersChange({ ...filters, [key]: filterValue });
  };

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined } | undefined) => {
    if (range?.from && range?.to) {
      onFiltersChange({ 
        ...filters, 
        dataInicial: format(range.from, 'yyyy-MM-dd'),
        dataFinal: format(range.to, 'yyyy-MM-dd')
      });
    } else if (!range?.from && !range?.to) {
      const newFilters = { ...filters };
      delete newFilters.dataInicial;
      delete newFilters.dataFinal;
      onFiltersChange(newFilters);
    }
  };

  const removeFilter = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const activeFiltersCount = Object.keys(filters).filter(key => filters[key] && filters[key] !== '').length;

  const dateRange = filters.dataInicial && filters.dataFinal ? {
    from: new Date(filters.dataInicial),
    to: new Date(filters.dataFinal)
  } : { from: undefined, to: undefined };

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
              value={filters.status || "all"} 
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
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
              value={filters.barbeiro || "all"} 
              onValueChange={(value) => handleFilterChange('barbeiro', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os barbeiros" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Carlos">Carlos</SelectItem>
                <SelectItem value="Marcos">Marcos</SelectItem>
                <SelectItem value="João">João</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Período - Único campo com range */}
          <div>
            <Label>Data</Label>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Selecionar período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
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
                  
                  let displayValue = String(value);
                  if (key === 'dataInicial' && filters.dataFinal) {
                    displayValue = `${format(new Date(filters.dataInicial), 'dd/MM/yyyy')} - ${format(new Date(filters.dataFinal), 'dd/MM/yyyy')}`;
                    return (
                      <Badge key="dateRange" variant="outline" className="flex items-center gap-1">
                        Período: {displayValue}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => {
                            const newFilters = { ...filters };
                            delete newFilters.dataInicial;
                            delete newFilters.dataFinal;
                            onFiltersChange(newFilters);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  }
                  
                  if (key === 'dataFinal') return null; // Já mostrado com dataInicial
                  
                  return (
                    <Badge key={key} variant="outline" className="flex items-center gap-1">
                      {key}: {displayValue}
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
