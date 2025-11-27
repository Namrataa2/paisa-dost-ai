import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";

const data = [
  { month: "Jan", actual: 35000, predicted: 36000 },
  { month: "Feb", actual: 42000, predicted: 41000 },
  { month: "Mar", actual: 38000, predicted: 39000 },
  { month: "Apr", actual: 45000, predicted: 44000 },
  { month: "May", actual: 48000, predicted: 47000 },
  { month: "Jun", actual: 49000, predicted: 51000 },
  { month: "Jul", predicted: 52000 },
  { month: "Aug", predicted: 54000 },
];

export const IncomeForecast = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Forecast</CardTitle>
        <CardDescription>AI-powered predictions</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            actual: {
              label: "Actual Income",
              color: "hsl(var(--chart-3))",
            },
            predicted: {
              label: "Predicted Income",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs text-muted-foreground"
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                className="text-xs text-muted-foreground"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value/1000}K`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="actual" 
                stroke="hsl(var(--chart-3))" 
                fill="url(#colorActual)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="predicted" 
                stroke="hsl(var(--chart-2))" 
                fill="url(#colorPredicted)"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground">This Month</p>
            <p className="text-xl font-bold">₹49K</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground">Next Month</p>
            <p className="text-xl font-bold text-success">₹54K</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground">Confidence</p>
            <p className="text-xl font-bold text-primary">87%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
