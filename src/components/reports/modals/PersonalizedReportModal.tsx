import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { notify } from "@/lib/notify";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { Loader2 } from "lucide-react";

interface PersonalizedReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PersonalizedReportModal = ({ open, onOpenChange }: PersonalizedReportModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    location: "",
    companySize: "",
    linkedinUrl: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabaseFrom('report_downloads')
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          job_title: formData.role,
          company: formData.companySize
        });

      if (error) throw error;

      notify.success("we'll send your personalized report to your email within 24 hours");
      
      onOpenChange(false);
      setFormData({
        fullName: "",
        email: "",
        role: "",
        location: "",
        companySize: "",
        linkedinUrl: ""
      });
    } catch (error) {
      notify.error("something went wrong. please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Get Your Personal GTM Career Report</DialogTitle>
          <DialogDescription>
            Everything in this report, personalized for your exact role, location, experience, and career goals. Plus quarterly updates as new data becomes available.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Work Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Current Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketing-manager">Marketing Manager</SelectItem>
                <SelectItem value="sales-ae">Sales Account Executive</SelectItem>
                <SelectItem value="revops">RevOps</SelectItem>
                <SelectItem value="marketing-ops">Marketing Operations</SelectItem>
                <SelectItem value="product-marketing">Product Marketing</SelectItem>
                <SelectItem value="sdr">SDR/BDR</SelectItem>
                <SelectItem value="sales-manager">Sales Manager</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, Country"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companySize">Company Size</Label>
            <Select value={formData.companySize} onValueChange={(value) => setFormData({ ...formData, companySize: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10 employees</SelectItem>
                <SelectItem value="11-50">11-50 employees</SelectItem>
                <SelectItem value="51-200">51-200 employees</SelectItem>
                <SelectItem value="201-500">201-500 employees</SelectItem>
                <SelectItem value="501-1000">501-1,000 employees</SelectItem>
                <SelectItem value="1001+">1,001+ employees</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn Profile URL (Optional)</Label>
            <Input
              id="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Get My Personal Report"
            )}
          </Button>
          
          <p className="text-xs text-secondary-label text-center">
            Used by 10,000+ GTM professionals to negotiate higher salaries
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
