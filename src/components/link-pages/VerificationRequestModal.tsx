import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateVerificationRequest,
  useUploadVerificationDocument,
} from "@/hooks/useVerificationStatus";
import {
  Phone,
  Mail,
  User,
  FileText,
  Upload,
  Plus,
  Trash2,
  Check,
  ArrowRight,
  ArrowLeft,
  Globe,
  Briefcase,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
}

const STEPS = [
  { id: 1, title: "Contact Info", description: "Phone & email verification" },
  { id: 2, title: "Identity", description: "Personal & document details" },
  { id: 3, title: "Social Proof", description: "Link your profiles" },
  { id: 4, title: "Review", description: "Submit application" },
];

const DOCUMENT_TYPES = [
  { value: "id_card", label: "Government ID Card" },
  { value: "passport", label: "Passport" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "business_license", label: "Business License" },
];

const CATEGORIES = [
  { value: "creator", label: "Creator", description: "Content creators, influencers" },
  { value: "business", label: "Business", description: "Companies, brands, startups" },
  { value: "public_figure", label: "Public Figure", description: "Politicians, celebrities" },
  { value: "brand", label: "Brand", description: "Product or service brands" },
  { value: "organization", label: "Organization", description: "Non-profits, institutions" },
];

const SOCIAL_PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter/X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "other", label: "Other" },
];

interface FormData {
  phone_number: string;
  email: string;
  full_name: string;
  document_type: string;
  document_url: string;
  business_name: string;
  business_website: string;
  category: string;
  reason_for_verification: string;
  social_links: Array<{ platform: string; url: string }>;
}

export function VerificationRequestModal({
  open,
  onOpenChange,
  workspaceId,
}: VerificationRequestModalProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    phone_number: "",
    email: "",
    full_name: "",
    document_type: "",
    document_url: "",
    business_name: "",
    business_website: "",
    category: "",
    reason_for_verification: "",
    social_links: [{ platform: "", url: "" }],
  });

  const createRequest = useCreateVerificationRequest();
  const uploadDocument = useUploadVerificationDocument();

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadDocument.mutateAsync(file);
      updateField("document_url", url);
      toast({ description: "Document uploaded successfully" });
    } catch (error) {
      toast({ variant: "destructive", description: "Failed to upload document" });
    }
  };

  const addSocialLink = () => {
    setFormData((prev) => ({
      ...prev,
      social_links: [...prev.social_links, { platform: "", url: "" }],
    }));
  };

  const removeSocialLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      social_links: prev.social_links.filter((_, i) => i !== index),
    }));
  };

  const updateSocialLink = (index: number, field: "platform" | "url", value: string) => {
    setFormData((prev) => ({
      ...prev,
      social_links: prev.social_links.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const validateStep = (stepNum: number): boolean => {
    switch (stepNum) {
      case 1:
        return formData.phone_number.length >= 10 && formData.email.includes("@");
      case 2:
        return (
          formData.full_name.length >= 2 &&
          formData.document_type !== "" &&
          formData.reason_for_verification.length >= 20
        );
      case 3:
        return formData.social_links.some((l) => l.platform && l.url);
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    try {
      await createRequest.mutateAsync({
        workspace_id: workspaceId,
        phone_number: formData.phone_number,
        email: formData.email,
        full_name: formData.full_name,
        document_type: formData.document_type,
        document_url: formData.document_url || undefined,
        business_name: formData.business_name || undefined,
        business_website: formData.business_website || undefined,
        category: formData.category || undefined,
        reason_for_verification: formData.reason_for_verification,
        social_links: formData.social_links.filter((l) => l.platform && l.url),
      });

      toast({
        title: "Application submitted!",
        description: "We'll review your application within 2-5 business days.",
      });
      onOpenChange(false);
      setStep(1);
      setFormData({
        phone_number: "",
        email: "",
        full_name: "",
        document_type: "",
        document_url: "",
        business_name: "",
        business_website: "",
        category: "",
        reason_for_verification: "",
        social_links: [{ platform: "", url: "" }],
      });
    } catch (error) {
      toast({ variant: "destructive", description: "Failed to submit application" });
    }
  };

  const progress = (step / STEPS.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Apply for Verification
            <Badge variant="secondary" className="text-xs">
              Step {step} of {STEPS.length}
            </Badge>
          </DialogTitle>
          <DialogDescription>{STEPS[step - 1].description}</DialogDescription>
        </DialogHeader>

        <Progress value={progress} className="h-1" />

        {/* Step 1: Contact Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone_number}
                onChange={(e) => updateField("phone_number", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Required for identity verification. We'll never share this.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                We'll notify you about your application status here.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Identity */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Full Legal Name
              </Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={(e) => updateField("full_name", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> Business Name
                </Label>
                <Input
                  placeholder="Optional"
                  value={formData.business_name}
                  onChange={(e) => updateField("business_name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Website
                </Label>
                <Input
                  placeholder="Optional"
                  value={formData.business_website}
                  onChange={(e) => updateField("business_website", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => updateField("category", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div>
                        <p className="font-medium">{cat.label}</p>
                        <p className="text-xs text-muted-foreground">{cat.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Document Type
              </Label>
              <Select
                value={formData.document_type}
                onValueChange={(v) => updateField("document_type", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select document" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((doc) => (
                    <SelectItem key={doc.value} value={doc.value}>
                      {doc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Upload Document (Optional)</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleDocumentUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadDocument.isPending}
              >
                {uploadDocument.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : formData.document_url ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {formData.document_url ? "Document Uploaded" : "Upload Document"}
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Why should you be verified?</Label>
              <Textarea
                placeholder="Explain why verification is important for your account (minimum 20 characters)"
                value={formData.reason_for_verification}
                onChange={(e) => updateField("reason_for_verification", e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.reason_for_verification.length}/20 min
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Social Proof */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Link your social profiles to help us verify your identity. At least one is required.
            </p>

            {formData.social_links.map((link, index) => (
              <div key={index} className="flex gap-2">
                <Select
                  value={link.platform}
                  onValueChange={(v) => updateSocialLink(index, "platform", v)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOCIAL_PLATFORMS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="https://..."
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                  className="flex-1"
                />
                {formData.social_links.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSocialLink(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={addSocialLink}
              className="w-full gap-2"
            >
              <Plus className="h-4 w-4" /> Add Another Profile
            </Button>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border p-4 space-y-3">
              <h4 className="font-medium">Application Summary</h4>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Name</div>
                <div>{formData.full_name}</div>
                
                <div className="text-muted-foreground">Phone</div>
                <div>{formData.phone_number}</div>
                
                <div className="text-muted-foreground">Email</div>
                <div>{formData.email}</div>
                
                {formData.category && (
                  <>
                    <div className="text-muted-foreground">Category</div>
                    <div className="capitalize">{formData.category}</div>
                  </>
                )}
                
                <div className="text-muted-foreground">Document</div>
                <div className="capitalize">{formData.document_type.replace("_", " ")}</div>
                
                <div className="text-muted-foreground">Social Links</div>
                <div>{formData.social_links.filter(l => l.platform && l.url).length} profiles</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm text-amber-600 dark:text-amber-400">
                By submitting, you confirm that all information is accurate. False information may result in permanent rejection.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>

          {step < STEPS.length ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!validateStep(step)}
            >
              Continue <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={createRequest.isPending}
            >
              {createRequest.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Check className="h-4 w-4 mr-1" />
              )}
              Submit Application
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
