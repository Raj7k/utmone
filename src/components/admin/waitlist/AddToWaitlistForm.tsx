import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  onSuccess: () => void;
};

export function AddToWaitlistForm({ onSuccess }: Props) {
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
      queryClient.invalidateQueries({ queryKey: ["waitlist-stats"] });
      toast({ title: "user added to waitlist" });
      onSuccess();
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="john doe"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@company.com"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company_domain">company domain</Label>
        <Input
          id="company_domain"
          value={formData.company_domain}
          onChange={(e) => setFormData({ ...formData, company_domain: e.target.value })}
          placeholder="company.com"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="team_size">team size</Label>
          <Select
            value={formData.team_size}
            onValueChange={(value) => setFormData({ ...formData, team_size: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="select" />
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
          <Label htmlFor="role">role</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => setFormData({ ...formData, role: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="marketing">marketing</SelectItem>
              <SelectItem value="sales">sales</SelectItem>
              <SelectItem value="operations">operations</SelectItem>
              <SelectItem value="developer">developer</SelectItem>
              <SelectItem value="founder">founder</SelectItem>
              <SelectItem value="other">other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={addMutation.isPending} className="w-full">
        {addMutation.isPending ? "adding..." : "add to waitlist"}
      </Button>
    </form>
  );
}
