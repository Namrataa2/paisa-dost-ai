import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, TrendingDown, PiggyBank } from "lucide-react";

const activities = [
  {
    icon: TrendingUp,
    title: "Salary Credited",
    time: "Today, 9:30 AM",
    amount: "+₹49,000",
    positive: true,
  },
  {
    icon: TrendingDown,
    title: "Grocery Shopping",
    time: "Yesterday, 6:45 PM",
    amount: "-₹2,450",
    positive: false,
  },
  {
    icon: PiggyBank,
    title: "Emergency Fund",
    time: "2 days ago",
    amount: "+₹5,000",
    positive: true,
  },
];

export const RecentActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${activity.positive ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  <activity.icon className={`w-5 h-5 ${activity.positive ? 'text-success' : 'text-destructive'}`} />
                </div>
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
              <span className={`font-semibold ${activity.positive ? 'text-success' : 'text-destructive'}`}>
                {activity.amount}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
