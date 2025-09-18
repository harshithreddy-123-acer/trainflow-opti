import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

interface PerformanceData {
  onTimeTrains: number;
  delayedTrains: number;
  conflictsResolved: number;
  totalConflicts: number;
  avgResolutionTime: number;
  efficiencyScore: number;
}

interface PerformanceStatsProps {
  isSimulating: boolean;
}

const PerformanceStats: React.FC<PerformanceStatsProps> = ({ isSimulating }) => {
  const [stats, setStats] = useState<PerformanceData>({
    onTimeTrains: 145,
    delayedTrains: 23,
    conflictsResolved: 34,
    totalConflicts: 38,
    avgResolutionTime: 2.3,
    efficiencyScore: 91.5
  });

  const [trends, setTrends] = useState({
    onTimeImprovement: 5.2,
    conflictReduction: 12.8,
    resolutionSpeedUp: 8.4
  });

  // Simulate real-time updates
  useEffect(() => {
    if (!isSimulating) return;
    
    const interval = setInterval(() => {
      setStats(prev => {
        const shouldUpdate = Math.random() > 0.7;
        if (!shouldUpdate) return prev;
        
        return {
          ...prev,
          onTimeTrains: prev.onTimeTrains + (Math.random() > 0.3 ? 1 : 0),
          delayedTrains: Math.max(0, prev.delayedTrains + (Math.random() > 0.6 ? -1 : Math.random() > 0.8 ? 1 : 0)),
          conflictsResolved: prev.conflictsResolved + (Math.random() > 0.8 ? 1 : 0),
          efficiencyScore: Math.min(100, prev.efficiencyScore + (Math.random() - 0.5) * 0.5)
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const totalTrains = stats.onTimeTrains + stats.delayedTrains;
  const punctualityRate = (stats.onTimeTrains / totalTrains) * 100;
  const conflictResolutionRate = (stats.conflictsResolved / stats.totalConflicts) * 100;

  return (
    <div className="space-y-4">
      <Card className="gradient-control border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" />
            Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Train Performance */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Train Punctuality</span>
                <Badge variant={punctualityRate >= 90 ? "default" : punctualityRate >= 80 ? "secondary" : "destructive"}>
                  {punctualityRate.toFixed(1)}%
                </Badge>
              </div>
              <Progress value={punctualityRate} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-success" />
                  On Time: {stats.onTimeTrains}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-warning" />
                  Delayed: {stats.delayedTrains}
                </span>
              </div>
            </div>

            {/* Conflict Resolution */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Conflict Resolution</span>
                <Badge variant={conflictResolutionRate >= 95 ? "default" : "secondary"}>
                  {conflictResolutionRate.toFixed(1)}%
                </Badge>
              </div>
              <Progress value={conflictResolutionRate} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Resolved: {stats.conflictsResolved}/{stats.totalConflicts}</span>
                <span>Avg Time: {stats.avgResolutionTime}min</span>
              </div>
            </div>

            {/* Efficiency Score */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Efficiency</span>
                <Badge variant="outline" className="text-accent border-accent">
                  {stats.efficiencyScore.toFixed(1)}/100
                </Badge>
              </div>
              <Progress value={stats.efficiencyScore} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Improvement Trends */}
      <Card className="gradient-control border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-2 bg-success/10 rounded border-l-4 border-success">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm">Punctuality Improvement</span>
              </div>
              <span className="text-sm font-medium text-success">+{trends.onTimeImprovement}%</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-accent/10 rounded border-l-4 border-accent">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-accent" />
                <span className="text-sm">Conflict Reduction</span>
              </div>
              <span className="text-sm font-medium text-accent">-{trends.conflictReduction}%</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-primary/10 rounded border-l-4 border-primary">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm">Resolution Speed</span>
              </div>
              <span className="text-sm font-medium text-primary">+{trends.resolutionSpeedUp}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceStats;