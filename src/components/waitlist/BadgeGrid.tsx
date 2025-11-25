import { WaitlistBadge } from "./WaitlistBadge";

interface Badge {
  id: string;
  badge_key: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tier: "bronze" | "silver" | "gold";
  points_required: number;
}

interface UserBadge {
  badge_id: string;
  awarded_at: string;
}

interface BadgeGridProps {
  allBadges: Badge[];
  userBadges: UserBadge[];
}

export const BadgeGrid = ({ allBadges, userBadges }: BadgeGridProps) => {
  const userBadgeIds = new Set(userBadges.map((ub) => ub.badge_id));

  const awardedBadges = allBadges.filter((badge) =>
    userBadgeIds.has(badge.id)
  );
  const lockedBadges = allBadges.filter(
    (badge) => !userBadgeIds.has(badge.id)
  );

  return (
    <div className="space-y-8">
      {/* Awarded Badges */}
      {awardedBadges.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            earned badges ({awardedBadges.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {awardedBadges.map((badge) => {
              const userBadge = userBadges.find(
                (ub) => ub.badge_id === badge.id
              );
              return (
                <WaitlistBadge
                  key={badge.id}
                  name={badge.name}
                  description={badge.description}
                  icon={badge.icon}
                  color={badge.color}
                  tier={badge.tier}
                  awarded={true}
                  awardedAt={userBadge?.awarded_at}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            available to unlock ({lockedBadges.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedBadges.map((badge) => (
              <WaitlistBadge
                key={badge.id}
                name={badge.name}
                description={badge.description}
                icon={badge.icon}
                color={badge.color}
                tier={badge.tier}
                awarded={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
