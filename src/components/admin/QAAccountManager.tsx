import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { notify } from "@/lib/notify";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Copy, CheckCircle2, Loader2 } from "lucide-react";

interface QAAccountResult {
  success: boolean;
  user: {
    id: string;
    email: string;
    fullName: string;
    isAdmin: boolean;
  };
  workspace: {
    id: string;
    name: string;
    slug: string;
    planTier: string;
  } | null;
}

export const QAAccountManager = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [planTier, setPlanTier] = useState<string>("free");
  const [workspaceName, setWorkspaceName] = useState("");
  const [createdAccount, setCreatedAccount] = useState<QAAccountResult | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('admin-create-qa-account', {
        body: {
          email,
          password,
          fullName: fullName || undefined,
          isAdmin,
          planTier,
          workspaceName: workspaceName || undefined,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data as QAAccountResult;
    },
    onSuccess: (data) => {
      setCreatedAccount(data);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      notify.success("qa account created", {
        description: `${data.user.email} is ready for testing`,
      });
    },
    onError: (error: Error) => {
      notify.error("failed to create account", {
        description: error.message,
      });
    },
  });

  const handleCreate = () => {
    if (!email || !password) {
      notify.error("email and password are required");
      return;
    }

    if (password.length < 6) {
      notify.error("password must be at least 6 characters");
      return;
    }

    createMutation.mutate();
  };

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleReset = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setIsAdmin(false);
    setPlanTier("free");
    setWorkspaceName("");
    setCreatedAccount(null);
  };

  // Quick presets for common QA scenarios
  const applyPreset = (preset: string) => {
    switch (preset) {
      case "free":
        setEmail(`qa-free-${Date.now()}@utm.one`);
        setPassword("QaTest123!");
        setPlanTier("free");
        setIsAdmin(false);
        break;
      case "growth":
        setEmail(`qa-growth-${Date.now()}@utm.one`);
        setPassword("QaTest123!");
        setPlanTier("growth");
        setIsAdmin(false);
        break;
      case "business":
        setEmail(`qa-business-${Date.now()}@utm.one`);
        setPassword("QaTest123!");
        setPlanTier("business");
        setIsAdmin(false);
        break;
      case "admin":
        setEmail(`qa-admin-${Date.now()}@utm.one`);
        setPassword("QaTest123!");
        setPlanTier("business");
        setIsAdmin(true);
        break;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>qa account manager</CardTitle>
            <CardDescription className="mt-1">
              create test accounts with specific roles and plan tiers
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Presets */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">quick presets</Label>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => applyPreset("free")}
              disabled={createMutation.isPending}
            >
              free user
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => applyPreset("growth")}
              disabled={createMutation.isPending}
            >
              growth user
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => applyPreset("business")}
              disabled={createMutation.isPending}
            >
              business user
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => applyPreset("admin")}
              disabled={createMutation.isPending}
            >
              admin user
            </Button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="qa-email">email *</Label>
            <Input
              id="qa-email"
              type="email"
              placeholder="qa-user@utm.one"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={createMutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qa-password">password *</Label>
            <Input
              id="qa-password"
              type="text"
              placeholder="min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={createMutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qa-name">full name</Label>
            <Input
              id="qa-name"
              placeholder="QA Tester"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={createMutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qa-workspace">workspace name</Label>
            <Input
              id="qa-workspace"
              placeholder="Auto-generated if empty"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              disabled={createMutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label>plan tier</Label>
            <Select value={planTier} onValueChange={setPlanTier} disabled={createMutation.isPending}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="starter">Starter ($29)</SelectItem>
                <SelectItem value="growth">Growth ($49)</SelectItem>
                <SelectItem value="business">Business ($149)</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>admin access</Label>
            <div className="flex items-center gap-3 pt-2">
              <Switch
                checked={isAdmin}
                onCheckedChange={setIsAdmin}
                disabled={createMutation.isPending}
              />
              <span className="text-sm text-muted-foreground">
                {isAdmin ? "has admin panel access" : "regular user"}
              </span>
            </div>
          </div>
        </div>

        {/* Create Button */}
        <Button
          onClick={handleCreate}
          disabled={createMutation.isPending || !email || !password}
          className="w-full"
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              creating account...
            </>
          ) : (
            "create qa account"
          )}
        </Button>

        {/* Created Account Details */}
        {createdAccount && (
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span className="font-medium text-emerald-300">account created successfully</span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-2 rounded bg-card border border-border">
                <div>
                  <span className="text-muted-foreground">email: </span>
                  <span className="font-mono">{createdAccount.user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(createdAccount.user.email, 'email')}
                >
                  {copiedField === 'email' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded bg-card border border-border">
                <div>
                  <span className="text-muted-foreground">password: </span>
                  <span className="font-mono">{password}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(password, 'password')}
                >
                  {copiedField === 'password' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <span className="text-muted-foreground">plan:</span>
                <Badge>{createdAccount.workspace?.planTier || 'no workspace'}</Badge>
                {createdAccount.user.isAdmin && (
                  <Badge variant="default">admin</Badge>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="w-full mt-4"
            >
              create another account
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
