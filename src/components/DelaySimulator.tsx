import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Zap, Clock, TrendingDown, TrendingUp } from 'lucide-react';

interface DelayScenario {
  type: 'weather' | 'breakdown' | 'maintenance' | 'congestion';
  severity: number;
  duration: number;
  affectedTrains: string[];
}

interface SimulationResult {
  avgDelayIncrease: number;
  throughputReduction: number;
  conflictsGenerated: number;
  recoveryTime: number;
}

const DelaySimulator = () => {
  const [scenario, setScenario] = useState<DelayScenario>({
    type: 'weather',
    severity: 5,
    duration: 15,
    affectedTrains: ['Express Mumbai', 'Local Delhi']
  });
  
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    
    // Simulate processing time
    setTimeout(() => {
      // Mock calculation based on scenario parameters
      const baseImpact = scenario.severity * 0.5;
      const durationMultiplier = scenario.duration / 10;
      
      const result: SimulationResult = {
        avgDelayIncrease: baseImpact * durationMultiplier * 2,
        throughputReduction: baseImpact * 1.5,
        conflictsGenerated: Math.floor(baseImpact * scenario.affectedTrains.length * 0.3),
        recoveryTime: scenario.duration * 1.5
      };
      
      setSimulationResult(result);
      setIsSimulating(false);
    }, 2000);
  };

  const getScenarioIcon = (type: string) => {
    switch (type) {
      case 'weather': return '🌧️';
      case 'breakdown': return '⚠️';
      case 'maintenance': return '🔧';
      case 'congestion': return '🚂';
      default: return '📊';
    }
  };

  return (
    <Card className="gradient-control border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          Delay Impact Simulator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Scenario Configuration */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Scenario Type</label>
              <Select 
                value={scenario.type} 
                onValueChange={(value: any) => setScenario(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weather">🌧️ Weather Delay</SelectItem>
                  <SelectItem value="breakdown">⚠️ Train Breakdown</SelectItem>
                  <SelectItem value="maintenance">🔧 Track Maintenance</SelectItem>
                  <SelectItem value="congestion">🚂 Heavy Traffic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Severity: {scenario.severity}/10
              </label>
              <Slider
                value={[scenario.severity]}
                onValueChange={(value) => setScenario(prev => ({ ...prev, severity: value[0] }))}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Duration: {scenario.duration} minutes
              </label>
              <Slider
                value={[scenario.duration]}
                onValueChange={(value) => setScenario(prev => ({ ...prev, duration: value[0] }))}
                max={60}
                min={5}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          {/* Affected Trains */}
          <div>
            <label className="text-sm font-medium mb-2 block">Affected Trains</label>
            <div className="flex gap-1 flex-wrap">
              {scenario.affectedTrains.map((train, index) => (
                <Badge key={index} variant="outline">{train}</Badge>
              ))}
            </div>
          </div>

          {/* Simulation Button */}
          <Button 
            onClick={runSimulation} 
            disabled={isSimulating}
            className="w-full"
          >
            {isSimulating ? 'Simulating...' : `${getScenarioIcon(scenario.type)} Run Simulation`}
          </Button>

          {/* Results */}
          {simulationResult && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Simulation Results
              </h4>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-destructive" />
                  <span>Avg Delay: +{simulationResult.avgDelayIncrease.toFixed(1)}min</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-warning" />
                  <span>Throughput: -{simulationResult.throughputReduction.toFixed(1)}%</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-destructive">⚠️</span>
                  <span>Conflicts: +{simulationResult.conflictsGenerated}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent" />
                  <span>Recovery: {simulationResult.recoveryTime}min</span>
                </div>
              </div>
              
              <div className="mt-3 p-2 bg-accent/10 rounded text-xs text-accent">
                💡 AI suggests implementing dynamic rerouting to reduce impact by 40%
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DelaySimulator;