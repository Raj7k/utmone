import { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { announcements, AnnouncementConfig } from "@/lib/announcementConfig";
import { AnnouncementScheduler } from "@/lib/announcementScheduler";
import { useAnnouncementTracking } from "@/hooks/useAnnouncementTracking";
import { cn } from "@/lib/utils";

interface AnnouncementBarProps {
  customAnnouncements?: AnnouncementConfig[];
  dismissible?: boolean;
  isAuthenticated?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
}

export const AnnouncementBar = ({ 
  customAnnouncements,
  dismissible = true,
  isAuthenticated = false,
  onVisibilityChange,
}: AnnouncementBarProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<AnnouncementConfig | null>(null);
  const { trackImpression, trackClick, trackDismissal } = useAnnouncementTracking();

  useEffect(() => {
    AnnouncementScheduler.trackVisit();

    const announcementsToUse = customAnnouncements || announcements;
    const selected = AnnouncementScheduler.selectAnnouncement(announcementsToUse, isAuthenticated);
    
    if (selected) {
      const dismissKey = `announcement-dismissed-${selected.id}`;
      const isDismissed = localStorage.getItem(dismissKey);
      
      if (!isDismissed) {
        setCurrentAnnouncement(selected);
        setIsVisible(true);
        onVisibilityChange?.(true);
        // Defer tracking to idle time for better performance
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            trackImpression(selected.id, selected.userSegment || 'all');
          }, { timeout: 2000 });
        } else {
          setTimeout(() => {
            trackImpression(selected.id, selected.userSegment || 'all');
          }, 1000);
        }
      }
    }
    // Removed 60s polling interval - announcements don't change that frequently
  }, [customAnnouncements, isAuthenticated]);

  const handleDismiss = () => {
    if (currentAnnouncement) {
      setIsVisible(false);
      onVisibilityChange?.(false);
      const dismissKey = `announcement-dismissed-${currentAnnouncement.id}`;
      localStorage.setItem(dismissKey, "true");
      trackDismissal(currentAnnouncement.id);
    }
  };

  const handleCTAClick = () => {
    if (currentAnnouncement && currentAnnouncement.ctaLink) {
      trackClick(currentAnnouncement.id, currentAnnouncement.ctaLink);
    }
  };

  if (!currentAnnouncement) {
    return null;
  }

  return (
    <div
      className={cn(
        "w-full bg-white/[0.03] backdrop-blur-sm border-b border-white/[0.06] overflow-hidden",
        "grid transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
        isVisible ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="min-h-0">
        <div className="max-w-[1280px] mx-auto px-4 py-2.5">
          <div className="flex items-center justify-center gap-3">
            {/* Coming Soon Badge */}
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/60 bg-white/[0.08] rounded-full border border-white/[0.08]">
              coming soon
            </span>

            {/* Message */}
            <p className="text-sm text-white/70 font-medium">
              {currentAnnouncement.message}
            </p>

            {/* CTA Link */}
            {currentAnnouncement.ctaText && currentAnnouncement.ctaLink && (
              <Link to={currentAnnouncement.ctaLink} onClick={handleCTAClick}>
                <div className="flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white hover:translate-x-0.5 transition-all duration-200">
                  <span className="hidden sm:inline">{currentAnnouncement.ctaText}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            )}

            {/* Dismiss Button */}
            {dismissible && (
              <button
                onClick={handleDismiss}
                className="ml-auto flex-shrink-0 text-white/40 hover:text-white/70 hover:scale-110 active:scale-90 transition-all duration-150 p-1"
                aria-label="dismiss announcement"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
