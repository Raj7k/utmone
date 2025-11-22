import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatedHeadline } from '@/components/landing/AnimatedHeadline';
import { useTrackPageView, useTrackClick } from '@/hooks/useWaitlistEngagement';

export default function Invite() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  
  useTrackPageView(`/invite/${code}`);
  const trackClick = useTrackClick();

  useEffect(() => {
    // Redirect to early access page with referral code
    if (code) {
      trackClick('referral_link_clicked', { referral_code: code });
      // Small delay for tracking
      setTimeout(() => {
        navigate(`/early-access?ref=${code}`);
      }, 100);
    } else {
      navigate('/early-access');
    }
  }, [code, navigate, trackClick]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-[600px]">
        <AnimatedHeadline>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            you've been invited to utm.one
          </h1>
        </AnimatedHeadline>
        <AnimatedHeadline delay={200}>
          <p className="text-xl text-muted-foreground">
            redirecting to early access...
          </p>
        </AnimatedHeadline>
      </div>
    </div>
  );
}
