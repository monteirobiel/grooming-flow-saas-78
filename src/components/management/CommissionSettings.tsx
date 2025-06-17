
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Percent, DollarSign, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const CommissionSettings = () => {
  const [comissaoPercentual, setComissaoPercentual] = useState(15);
  const [tempPercentual, setTempPercentual] = useState(15);

  // Carregar configuração salva
  useEffect(() => {
    const savedComissao = localStorage.getItem('barbershop-comissao');
    if (savedComissao) {
      const percentual = parseFloat(savedComissao);
      setComissaoPercentual(percentual);
      setTempPercentual(percentual);
    }
  }, []);

  const handleSaveCommission = () => {
    if (tempPercentual < 0 || tempPercentual > 100) {
      toast({
        title: "Erro",
        description: "A porcentagem deve estar entre 0% e 100%",
        variant: "destructive"
      });
      return;
    }

    try {
      localStorage.setItem('barbershop-comissao', tempPercentual.toString());
      setComissaoPercentual(tempPercentual);
      
      // Disparar evento para notificar outros componentes
      window.dispatchEvent(new CustomEvent('comissaoUpdated', { 
        detail: { comissao: tempPercentual } 
      }));

      toast({
        title: "Configuração salva!",
        description: `Comissão definida para ${tempPercentual}%`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar a configuração",
        variant: "destructive"
      });
    }
  };

  const exemploCalculo = {
    valorServico: 50,
    comissaoBarbeiro: (50 * tempPercentual) / 100,
    valorBarbearia: 50 - (50 * tempPercentual) / 100
  };

  return (
    <div className="space-y-6">
      {/* Configuração da Comissão */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-primary" />
            Configuração de Repasse para Barbeiros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Como funciona o repasse:</p>
                <ul className="text-blue-800 space-y-1 list-disc list-inside">
                  <li>O barbeiro recebe a porcentagem definida do valor do serviço</li>
                  <li>A barbearia fica com o restante do valor</li>
                  <li>No dashboard do barbeiro aparece apenas o valor do repasse</li>
                  <li>No dashboard do dono aparece o faturamento bruto e líquido</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label htmlFor="commission-slider">Porcentagem de Repasse</Label>
                <Badge variant="outline" className="text-lg font-bold">
                  {tempPercentual}%
                </Badge>
              </div>
              
              <Slider
                id="commission-slider"
                min={0}
                max={50}
                step={1}
                value={[tempPercentual]}
                onValueChange={(value) => setTempPercentual(value[0])}
                className="w-full"
              />
              
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="commission-input">Ou digite a porcentagem</Label>
                <Input
                  id="commission-input"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={tempPercentual}
                  onChange={(e) => setTempPercentual(parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </div>

            <Button onClick={handleSaveCommission} className="w-full">
              Salvar Configuração de Repasse
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exemplo de Cálculo */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-success" />
            Exemplo de Cálculo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Valor do Serviço:</span>
              <span className="text-lg font-bold">R$ {exemploCalculo.valorServico.toFixed(2)}</span>
            </div>
            
            <hr className="border-border" />
            
            <div className="flex justify-between items-center text-primary">
              <span className="font-medium">Repasse do Barbeiro ({tempPercentual}%):</span>
              <span className="text-lg font-bold">R$ {exemploCalculo.comissaoBarbeiro.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center text-success">
              <span className="font-medium">Valor da Barbearia ({100 - tempPercentual}%):</span>
              <span className="text-lg font-bold">R$ {exemploCalculo.valorBarbearia.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Atual */}
      <Card className="card-modern border-primary">
        <CardHeader>
          <CardTitle className="text-primary">Configuração Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Porcentagem de repasse configurada:</p>
              <p className="text-sm text-muted-foreground">
                Esta configuração está sendo aplicada a todos os cálculos
              </p>
            </div>
            <Badge className="text-xl font-bold px-4 py-2">
              {comissaoPercentual}%
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
