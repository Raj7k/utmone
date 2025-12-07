import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Clock, Shield, Loader2, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function ProfileSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
    } else if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
  }, [profile, user]);

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('No user');
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({ title: "profile updated", description: "your profile has been saved." });
    },
    onError: () => {
      toast({ title: "error", description: "failed to update profile.", variant: "destructive" });
    },
  });

  const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    if (email) return email[0].toUpperCase();
    return 'U';
  };

  if (userLoading || profileLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-2 font-semibold heading mb-2">profile</h2>
        <p className="text-body-apple text-secondary-label">manage your personal information</p>
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-6">
          <div className="relative group">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {getInitials(fullName || profile?.full_name, user?.email)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-label">full name</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" className="mt-1.5" />
            </div>
            <div>
              <Label className="text-sm font-medium text-label">email address</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <Input value={user?.email || ""} disabled className="bg-muted" />
                <Badge variant="outline" className="shrink-0"><Shield className="h-3 w-3 mr-1" />verified</Badge>
              </div>
              <p className="text-xs text-secondary-label mt-1">email cannot be changed</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-title-3 font-semibold heading mb-4">account information</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2"><User className="h-4 w-4 text-secondary-label" /><span className="text-sm text-label">user id</span></div>
            <code className="text-xs font-mono text-secondary-label bg-muted px-2 py-1 rounded">{user?.id?.slice(0, 8)}...</code>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-secondary-label" /><span className="text-sm text-label">authentication</span></div>
            <Badge variant="outline">{user?.app_metadata?.provider || 'email'}</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-secondary-label" /><span className="text-sm text-label">member since</span></div>
            <span className="text-sm text-secondary-label">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => updateProfileMutation.mutate()} disabled={updateProfileMutation.isPending}>
          {updateProfileMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          save changes
        </Button>
      </div>
    </div>
  );
}
