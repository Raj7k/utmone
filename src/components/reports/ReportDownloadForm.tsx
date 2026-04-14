import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { notify } from "@/lib/notify";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  jobTitle: z.string().min(1, "Please select your job title"),
  company: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ReportDownloadFormProps {
  onSuccess: () => void;
}

export const ReportDownloadForm = ({ onSuccess }: ReportDownloadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Insert into report_downloads table
      const { error: dbError } = await supabaseFrom('report_downloads')
        .insert({
          full_name: data.fullName,
          email: data.email,
          job_title: data.jobTitle,
          company: data.company || null,
        });

      if (dbError) throw dbError;

      // Call edge function to send email
      const { error: emailError } = await supabase.functions.invoke(
        "send-salary-report-pdf",
        {
          body: {
            fullName: data.fullName,
            email: data.email,
            jobTitle: data.jobTitle,
          },
        }
      );

      if (emailError) throw emailError;

      notify.success("success!", { description: "check your email for the download link." });

      onSuccess();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      notify.error("error", { description: "failed to send report. please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const jobTitles = [
    "Marketing Manager",
    "Senior Marketing Manager",
    "Marketing Director",
    "VP Marketing",
    "CMO",
    "Sales Manager",
    "Sales Director",
    "VP Sales",
    "CRO",
    "RevOps Manager",
    "Marketing Operations Manager",
    "Other",
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          {...register("fullName")}
          placeholder="John Smith"
          className="mt-2"
        />
        {errors.fullName && (
          <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Work Email *</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="john@company.com"
          className="mt-2"
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="jobTitle">Job Title *</Label>
        <Select onValueChange={(value) => setValue("jobTitle", value)}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            {jobTitles.map((title) => (
              <SelectItem key={title} value={title}>
                {title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.jobTitle && (
          <p className="text-sm text-destructive mt-1">{errors.jobTitle.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="company">Company (Optional)</Label>
        <Input
          id="company"
          {...register("company")}
          placeholder="Acme Inc."
          className="mt-2"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full bg-blazeOrange hover:bg-blazeOrange/90 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending Report...
          </>
        ) : (
          "Download Full PDF Report"
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        We respect your privacy. Unsubscribe anytime.
      </p>
    </form>
  );
};
