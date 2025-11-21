import { useState } from 'react';
import { useLandingAnalytics } from '@/hooks/useLandingAnalytics';
import { ABTestResults } from '@/components/landing/ABTestResults';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingAnalytics = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<number>(30);
  const { data: metrics, isLoading } = useLandingAnalytics(dateRange);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          <Select
            value={dateRange.toString()}
            onValueChange={(value) => setDateRange(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        ) : metrics && metrics.length > 0 ? (
          <ABTestResults metrics={metrics} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No data available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingAnalytics;
