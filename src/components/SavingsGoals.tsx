import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Progress } from "./ui/progress";
import { Shield, Smartphone, Plane, TrendingUp } from "lucide-react";

const goals = [
  {
    icon: Shield,
    name: "Emergency Fund",
    current: 45000,
    target: 100000,
    color: "text-primary",
  },
  {
    icon: Smartphone,
    name: "New Phone",
    current: 12000,
    target: 30000,
    color: "text-chart-3",
  },
  {
    icon: Plane,
    name: "Vacation",
    current: 8000,
    target: 50000,
    color: "text-chart-4",
  },
  {
    icon: TrendingUp,
    name: "Investment",
    current: 25000,
    target: 100000,
    color: "text-chart-2",
  },
];

export const SavingsGoals = () => {
  const totalCurrent = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Savings Goals</CardTitle>
            <CardDescription>Track your progress</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">₹{(totalCurrent/1000).toFixed(0)}K</p>
            <p className="text-xs text-muted-foreground">of ₹{(totalTarget/1000).toFixed(0)}K</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => {
          const percentage = Math.round((goal.current / goal.target) * 100);
          return (
            <div key={goal.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-accent ${goal.color}`}>
                    <goal.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{goal.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium">{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
