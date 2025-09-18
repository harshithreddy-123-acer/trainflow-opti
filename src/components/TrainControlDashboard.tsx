import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Train,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Signal,
  Settings,
  Play,
  Pause,
  BarChart,
  Users,
  Lightbulb
} from 'lucide-react';

interface Train {
  id: string;
  name: string;
  position: number;
  speed: number;
  status: 'moving' | 'stopped' | 'delayed';
  destination: string;
  latlng: [number, number];
}

interface Recommendation {
  id: string;
  type: 'priority' | 'hold' | 'route';
  description: string;
  explanation: string;
  impact: string;
  confidence: number;
}

const TrainControlDashboard = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [trains, setTrains] = useState<Train[]>([
    { id: 'T001', name: 'Express Mumbai', position: 25, speed: 85, status: 'moving', destination: 'Mumbai Central', latlng: [19.076, 72.8777] },
    { id: 'T002', name: 'Local Delhi', position: 60, speed: 45, status: 'delayed', destination: 'New Delhi', latlng: [28.6139, 77.209] },
    { id: 'T003', name: 'Freight Cargo', position: 40, speed: 30, status: 'stopped', destination: 'Cargo Terminal', latlng: [19.0, 72.8] },
  ]);

  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: 'R001',
      type: 'priority',
      description: 'Give priority to Express Mumbai at Junction B',
      explanation: 'Express Mumbai is approaching Junction B with high passenger load (450+ passengers) and strict schedule adherence requirements. Current signal timing would cause 8-minute delay. Priority passage will maintain schedule while Local Delhi can absorb 3-minute delay with minimal passenger impact.',
      impact: '+12% throughput improvement',
      confidence: 94
    },
    {
      id: 'R002',
      type: 'hold',
      description: 'Hold Local Delhi for 3 minutes to avoid conflict',
      explanation: 'Predictive analysis shows Local Delhi and Freight Cargo will create deadlock at Platform 2 in 4 minutes. Holding Local Delhi for 3 minutes allows Freight Cargo to clear the platform, preventing cascade delays across 3 downstream trains. Safety buffer maintained at 2.5 minutes headway.',
      impact: '-8 minutes total delay',
      confidence: 87
    }
  ]);

  const kpis = {
    throughput: 156,
    avgDelay: 4.2,
    punctuality: 89.5,
    acceptanceRate: 76.3,
    safetyViolations: 0
  };

  // Simulate train movement
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setTrains(prev => prev.map(train => ({
        ...train,
        position: train.status === 'moving'
          ? Math.min(100, train.position + Math.random() * 2)
          : train.position
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleAcceptRecommendation = (id: string) => {
    setRecommendations(prev => prev.filter(r => r.id !== id));
    // Here you would apply the recommendation logic
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'moving': return 'green';
      case 'delayed': return 'orange';
      case 'stopped': return 'red';
      default: return 'gray';
    }
  };

  const track: [number, number][] = [[19.076, 72.8777], [28.6139, 77.209]]; // Mumbai to Delhi

  const getLatLng = (position: number): [number, number] => {
    const [lat1, lng1] = track[0];
    const [lat2, lng2] = track[1];
    const lat = lat1 + (lat2 - lat1) * (position / 100);
    const lng = lng1 + (lng2 - lng1) * (position / 100);
    return [lat, lng];
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border gradient-control p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Train className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-primary">RailWay AI Control</h1>
              <p className="text-sm text-muted-foreground">Smart India Hackathon - Train Traffic Optimizer</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={isSimulating ? "destructive" : "default"}
              onClick={() => setIsSimulating(!isSimulating)}
              className="flex items-center gap-2"
            >
              {isSimulating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isSimulating ? 'Stop' : 'Start'} Simulation
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* KPI Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="gradient-control border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary pulse-signal" />
                Throughput
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{kpis.throughput}</div>
              <p className="text-xs text-muted-foreground">trains/hour</p>
            </CardContent>
          </Card>

          <Card className="gradient-control border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-warning" />
                Avg Delay
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{kpis.avgDelay}m</div>
              <p className="text-xs text-muted-foreground">minutes</p>
            </CardContent>
          </Card>

          <Card className="gradient-control border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Punctuality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{kpis.punctuality}%</div>
              <p className="text-xs text-muted-foreground">on-time</p>
            </CardContent>
          </Card>

          <Card className="gradient-control border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" />
                AI Acceptance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{kpis.acceptanceRate}%</div>
              <p className="text-xs text-muted-foreground">accepted</p>
            </CardContent>
          </Card>

          <Card className="gradient-control border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-success" />
                Safety
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{kpis.safetyViolations}</div>
              <p className="text-xs text-muted-foreground">violations</p>
            </CardContent>
          </Card>
        </div>

        {/* Clean Main Dashboard - No Tabs */}
        <div className="space-y-6">
          {/* System Status Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Live Track Status - Main Focus */}
            <Card className="lg:col-span-2 gradient-control border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Signal className="h-5 w-5 text-primary" />
                  Live Train Status
                </CardTitle>
                <p className="text-sm text-muted-foreground">Real-time train positions and status</p>
              </CardHeader>
              <CardContent>
                <MapContainer center={[23.5, 75]} zoom={5} style={{ height: '400px', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Polyline positions={track} pathOptions={{ color: 'blue', weight: 4 }} />
                  {trains.map((train) => {
                    const pos = getLatLng(train.position);
                    return (
                      <CircleMarker center={pos} pathOptions={{ color: getStatusColor(train.status), fillOpacity: 0.8, radius: 8 }}>
                        <Popup>
                          <div>
                            <strong>{train.name}</strong><br />
                            Destination: {train.destination}<br />
                            Speed: {train.speed} km/h<br />
                            Status: {train.status}
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}
                </MapContainer>
              </CardContent>
            </Card>

            {/* AI Recommendations - Key Actions */}
            <Card className="gradient-control border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-accent" />
                  AI Suggestions
                </CardTitle>
                <p className="text-sm text-muted-foreground">Smart recommendations to optimize operations</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-2 text-success" />
                      <p className="font-medium">All systems optimal</p>
                      <p className="text-xs">No immediate actions needed</p>
                    </div>
                  ) : (
                    recommendations.slice(0, 2).map((rec) => (
                      <div key={rec.id} className="p-4 border border-border rounded-lg bg-card/50">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-accent border-accent">
                              {rec.type.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{rec.confidence}%</span>
                          </div>
                          <p className="text-sm font-medium leading-relaxed">{rec.description}</p>
                          <p className="text-xs text-success font-medium">{rec.impact}</p>
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={() => handleAcceptRecommendation(rec.id)}
                              className="flex-1 bg-success hover:bg-success/90"
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAcceptRecommendation(rec.id)}
                              className="flex-1"
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Panel */}
            <Card className="gradient-control border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
                <p className="text-sm text-muted-foreground">Common control operations</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant={isSimulating ? "destructive" : "default"}
                  onClick={() => setIsSimulating(!isSimulating)}
                  className="w-full flex items-center gap-2"
                >
                  {isSimulating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
                </Button>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Check Conflicts
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <BarChart className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Zap className="h-4 w-4 mr-2" />
                    Run Simulator
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Team Collaboration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Health Summary */}
          <Card className="gradient-control border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                System Health Overview
              </CardTitle>
              <p className="text-sm text-muted-foreground">Key performance indicators and system status</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 border border-border rounded-lg bg-card/30">
                  <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{kpis.throughput}</div>
                  <p className="text-sm text-muted-foreground">Throughput</p>
                  <p className="text-xs text-muted-foreground">trains/hour</p>
                </div>

                <div className="text-center p-4 border border-border rounded-lg bg-card/30">
                  <Clock className="h-8 w-8 text-warning mx-auto mb-2" />
                  <div className="text-2xl font-bold text-warning">{kpis.avgDelay}m</div>
                  <p className="text-sm text-muted-foreground">Avg Delay</p>
                  <p className="text-xs text-muted-foreground">minutes</p>
                </div>

                <div className="text-center p-4 border border-border rounded-lg bg-card/30">
                  <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                  <div className="text-2xl font-bold text-success">{kpis.punctuality}%</div>
                  <p className="text-sm text-muted-foreground">Punctuality</p>
                  <p className="text-xs text-muted-foreground">on-time</p>
                </div>

                <div className="text-center p-4 border border-border rounded-lg bg-card/30">
                  <Zap className="h-8 w-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-accent">{kpis.acceptanceRate}%</div>
                  <p className="text-sm text-muted-foreground">AI Acceptance</p>
                  <p className="text-xs text-muted-foreground">rate</p>
                </div>

                <div className="text-center p-4 border border-border rounded-lg bg-card/30">
                  <AlertTriangle className="h-8 w-8 text-success mx-auto mb-2" />
                  <div className="text-2xl font-bold text-success">{kpis.safetyViolations}</div>
                  <p className="text-sm text-muted-foreground">Safety</p>
                  <p className="text-xs text-muted-foreground">violations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrainControlDashboard;
