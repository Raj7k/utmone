import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

export function AddToWaitlist() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company_domain: "",
    team_size: "",
    role: "",
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("early_access_requests")
        .insert({
          name: formData.name,
          email: formData.email,
          company_domain: formData.company_domain,
          team_size: formData.team_size,
          role: formData.role,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["early-access-requests"] });
      toast({ title: "user added to waitlist", description: "user has been added to the pending queue" });
      setFormData({
        name: "",
        email: "",
        company_domain: "",
        team_size: "",
        role: "",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "error adding user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Add to waitlist
        </CardTitle>
        <CardDescription>
          manually add users to the pending queue for approval
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@company.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_domain">Company domain</Label>
            <Input
              id="company_domain"
              value={formData.company_domain}
              onChange={(e) => setFormData({ ...formData, company_domain: e.target.value })}
              placeholder="company.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team_size">Team size</Label>
            <Select
              value={formData.team_size}
              onValueChange={(value) => setFormData({ ...formData, team_size: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10</SelectItem>
                <SelectItem value="11-50">11-50</SelectItem>
                <SelectItem value="51-200">51-200</SelectItem>
                <SelectItem value="201-500">201-500</SelectItem>
                <SelectItem value="500+">500+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="founder">Founder</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={addMutation.isPending} className="w-full">
            {addMutation.isPending ? "Adding..." : "Add to waitlist"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
