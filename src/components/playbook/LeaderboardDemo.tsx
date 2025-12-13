import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, TrendingUp, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppleReveal } from "./AppleReveal";

interface LeaderboardEntry {
  rank: number;
  name: string;
  company: string;
  referrals: number;
  badge: string;
}

const initialLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Priya Sharma", company: "TechCorp India", referrals: 487, badge: "🏆" },
  { rank: 2, name: "Rahul Mehta", company: "StartupXYZ", referrals: 312, badge: "🥈" },
  { rank: 3, name: "Anita Kumar", company: "GlobalHR Solutions", referrals: 289, badge: "🥉" },
  { rank: 4, name: "Vikram Singh", company: "People First", referrals: 156, badge: "⭐" },
  { rank: 5, name: "Neha Patel", company: "HR Innovate", referrals: 134, badge: "⭐" },
];

export const LeaderboardDemo = () => {
  const [leaderboard, setLeaderboard] = useState(initialLeaderboard);
  const [newConversion, setNewConversion] = useState<string | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLeaderboard(prev => {
        const updated = [...prev];
        const randomIndex = Math.floor(Math.random() * updated.length);
        const increment = Math.floor(Math.random() * 3) + 1;
        updated[randomIndex] = {
          ...updated[randomIndex],
          referrals: updated[randomIndex].referrals + increment
        };
        
        // Sort by referrals
        updated.sort((a, b) => b.referrals - a.referrals);
        
        // Update ranks
        updated.forEach((entry, i) => {
          entry.rank = i + 1;
          entry.badge = i === 0 ? "🏆" : i === 1 ? "🥈" : i === 2 ? "🥉" : "⭐";
        });

        setNewConversion(updated[randomIndex].name);
        setTimeout(() => setNewConversion(null), 1500);
        
        return updated;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppleReveal>
      <Card className="p-6 bg-card border-border overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Live Leaderboard</h3>
              <p className="text-sm text-muted-foreground">Watch it update in real-time</p>
            </div>
          </div>
          
          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>

        {/* New conversion notification */}
        <AnimatePresence>
          {newConversion && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 flex items-center justify-center gap-2 py-2 px-4 bg-green-500/10 border border-green-500/20 rounded-lg"
            >
              <Sparkles className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">
                New referral for {newConversion}!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leaderboard entries */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {leaderboard.map((entry) => (
              <motion.div
                key={entry.name}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: newConversion === entry.name ? 1.02 : 1
                }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ 
                  layout: { type: "spring", stiffness: 500, damping: 30 },
                  duration: 0.3
                }}
                className={`
                  flex items-center justify-between py-3 px-4 rounded-lg
                  ${entry.rank <= 3 ? 'bg-gradient-to-r from-amber-500/5 to-transparent' : 'bg-muted/30'}
                  ${newConversion === entry.name ? 'ring-2 ring-green-500/50' : ''}
                  transition-all duration-300
                `}
              >
                <div className="flex items-center gap-4">
                  {/* Rank badge */}
                  <div className="w-8 text-center">
                    <span className="text-xl">{entry.badge}</span>
                  </div>
                  
                  {/* Name and company */}
                  <div>
                    <div className="font-medium text-foreground">{entry.name}</div>
                    <div className="text-xs text-muted-foreground">{entry.company}</div>
                  </div>
                </div>

                {/* Referral count */}
                <div className="flex items-center gap-2">
                  <motion.div
                    key={entry.referrals}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-xl font-bold text-foreground font-mono"
                  >
                    {entry.referrals}
                  </motion.div>
                  {entry.rank <= 3 && (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Showing top 5 of 982 referrers
          </span>
          <Badge variant="outline" className="text-xs">
            Season 5
          </Badge>
        </div>
      </Card>
    </AppleReveal>
  );
};
