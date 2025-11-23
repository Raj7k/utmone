import { useState, useEffect } from 'react';
import { useLandingAnalytics } from '@/hooks/useLandingAnalytics';
import { ABTestResults } from '@/components/landing/ABTestResults';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const LandingAnalytics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<number>(30);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { data: metrics, isLoading } = useLandingAnalytics(dateRange);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/auth');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_super_admin')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAuthorized(false);
          toast({
            title: "Error",
            description: "Failed to verify admin access",
            variant: "destructive",
          });
          return;
        }

        if (!profile?.is_super_admin) {
          setIsAuthorized(false);
          toast({
            title: "Access Denied",
            description: "This page is restricted to super admins only",
            variant: "destructive",
          });
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setIsAuthorized(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAdminAccess();
  }, [navigate, toast]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">verifying access...</p>
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-display font-semibold mb-2">access denied</h1>
          <p className="text-muted-foreground mb-6">
            this page is restricted to super admins only.
          </p>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            back to dashboard
          </Button>
        </div>
      </div>
    );
  }

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
