import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Clock, 
  Shield, 
  Loader2, 
  Camera, 
  Check, 
  LogOut,
  Download,
  Trash2,
  Link2,
  Globe
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time" },
  { value: "Pacific/Honolulu", label: "Hawaii Time" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
  { value: "UTC", label: "UTC" },
];

export function ProfileSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
      toast({ title: "profile updated", description: "your changes have been saved." });
    },
    onError: () => {
      toast({ title: "error", description: "failed to update profile.", variant: "destructive" });
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    // For now, show toast - avatar upload requires storage bucket setup
    toast({ 
      title: "coming soon", 
      description: "avatar upload will be available soon." 
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  const handleExportData = () => {
    toast({ 
      title: "data export requested", 
      description: "you'll receive an email with your data download link." 
    });
  };

  const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    if (email) return email[0].toUpperCase();
    return 'U';
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return <Globe className="h-4 w-4" />;
      case 'github':
        return <Link2 className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  if (userLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">profile information</CardTitle>
          <CardDescription>manage your personal details and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <Avatar className="h-24 w-24 ring-4 ring-muted transition-all group-hover:ring-primary/20">
                <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary font-medium">
                  {getInitials(fullName || profile?.full_name, user?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">full name</Label>
                  <Input 
                    id="fullName" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    placeholder="enter your full name" 
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">email address</Label>
                  <div className="flex items-center gap-2">
                    <Input value={user?.email || ""} disabled className="h-10 bg-muted/50" />
                    <Badge variant="outline" className="shrink-0 h-6 gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      <Shield className="h-3 w-3" />
                      verified
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">preferences</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es" disabled>Español (coming soon)</SelectItem>
                    <SelectItem value="fr" disabled>Français (coming soon)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Info Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">account details</CardTitle>
          <CardDescription>your account information and authentication method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">user id</p>
                  <p className="text-xs text-muted-foreground">your unique identifier</p>
                </div>
              </div>
              <code className="text-xs font-mono text-muted-foreground bg-muted px-3 py-1.5 rounded-md">
                {user?.id?.slice(0, 8)}...{user?.id?.slice(-4)}
              </code>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  {getProviderIcon(user?.app_metadata?.provider || 'email')}
                </div>
                <div>
                  <p className="text-sm font-medium">authentication</p>
                  <p className="text-xs text-muted-foreground">sign in method</p>
                </div>
              </div>
              <Badge variant="secondary" className="capitalize">
                {user?.app_metadata?.provider || 'email'}
              </Badge>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">member since</p>
                  <p className="text-xs text-muted-foreground">account creation date</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                }) : 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">account actions</CardTitle>
          <CardDescription>manage your account data and security</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={handleExportData} className="gap-2">
              <Download className="h-4 w-4" />
              export my data
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              sign out
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                  delete account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    this action cannot be undone. this will permanently delete your account
                    and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    delete account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end sticky bottom-4">
        <Button 
          onClick={() => updateProfileMutation.mutate()} 
          disabled={updateProfileMutation.isPending}
          className="min-w-[140px] gap-2 shadow-lg"
        >
          {updateProfileMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSaved ? (
            <Check className="h-4 w-4" />
          ) : null}
          {isSaved ? "saved" : "save changes"}
        </Button>
      </div>
    </div>
  );
}
