import { useReferralLeaderboard } from '@/hooks/useReferralStats';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, TrendingUp, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const ReferralLeaderboard = () => {
  const { data: leaderboard, isLoading } = useReferralLeaderboard(20);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>referral leaderboard</CardTitle>
          <CardDescription>top referrers by score</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-secondary-label">loading...</p>
        </CardContent>
      </Card>
    );
  }

  const topThree = leaderboard?.slice(0, 3) || [];
  const rest = leaderboard?.slice(3) || [];

  return (
    <div className="space-y-6">
      {/* Top 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topThree.map((user, index) => {
          const medals = ['🥇', '🥈', '🥉'];
          const colors = ['text-yellow-600', 'text-gray-400', 'text-amber-600'];
          
          return (
            <Card key={user.id} className="relative overflow-hidden">
              <div className={`absolute top-0 right-0 text-6xl opacity-10 ${colors[index]}`}>
                {medals[index]}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      <span className="mr-2">{medals[index]}</span>
                      {user.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {user.email}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    #{index + 1}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary-label">score</span>
                  <span className="font-semibold text-lg">{user.referral_score}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary-label flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    referrals
                  </span>
                  <span className="font-medium">{user.referral_count}</span>
                </div>
                <div className="text-xs text-secondary-label">
                  joined {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Rest of Leaderboard Table */}
      {rest.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>full leaderboard</CardTitle>
            <CardDescription>all referrers ranked by score</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">rank</TableHead>
                  <TableHead>name</TableHead>
                  <TableHead>email</TableHead>
                  <TableHead className="text-right">score</TableHead>
                  <TableHead className="text-right">referrals</TableHead>
                  <TableHead>joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rest.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">#{index + 4}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell className="text-secondary-label">{user.email}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{user.referral_score}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Users className="h-3 w-3 text-secondary-label" />
                        <span>{user.referral_count}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-secondary-label text-sm">
                      {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">total referrers</CardTitle>
            <Users className="h-4 w-4 text-secondary-label" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaderboard?.length || 0}</div>
            <p className="text-xs text-secondary-label">
              users with at least 1 referral
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">total referrals</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary-label" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaderboard?.reduce((sum, user) => sum + user.referral_count, 0) || 0}
            </div>
            <p className="text-xs text-secondary-label">
              across all referrers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">avg per referrer</CardTitle>
            <Trophy className="h-4 w-4 text-secondary-label" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaderboard && leaderboard.length > 0
                ? (leaderboard.reduce((sum, user) => sum + user.referral_count, 0) / leaderboard.length).toFixed(1)
                : '0'}
            </div>
            <p className="text-xs text-secondary-label">
              referrals per active user
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
