import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCards } from "@/components/StatsCards";
import { IncomeForecast } from "@/components/IncomeForecast";
import { SavingsGoals } from "@/components/SavingsGoals";
import { RecentActivity } from "@/components/RecentActivity";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, Rahul!</h1>
          <p className="text-muted-foreground mt-1">Here's your financial overview for today</p>
        </div>
        
        <StatsCards />
        
        <div className="grid lg:grid-cols-2 gap-6">
          <IncomeForecast />
          <SavingsGoals />
        </div>
        
        <RecentActivity />
      </div>
    </DashboardLayout>
  );
};

export default Index;
