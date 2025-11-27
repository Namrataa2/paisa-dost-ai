import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const stats = [
  {
    icon: Wallet,
    label: "Total Balance",
    value: "₹1,23,450",
    change: "+12.5%",
    positive: true,
  },
  {
    icon: TrendingUp,
    label: "Monthly Income",
    value: "₹49,000",
    change: "+8.2%",
    positive: true,
  },
  {
    icon: TrendingDown,
    label: "Monthly Expenses",
    value: "₹28,500",
    change: "-5.1%",
    positive: false,
  },
  {
    icon: PiggyBank,
    label: "Savings Rate",
    value: "42%",
    change: "+3.2%",
    positive: true,
  },
];

export const StatsCards = () => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-accent">
                <stat.icon className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className={`text-sm font-medium ${stat.positive ? 'text-success' : 'text-destructive'}`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
