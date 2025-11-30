import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

const earlyAccessSchema = z.object({
  name: z.string().min(1, "name is required").max(100),
  email: z.string().email("please enter a valid email").max(255),
  role: z.string().min(1, "please select a role"),
  team_size: z.string().min(1, "please select team size"),
  reason_for_joining: z.string().min(1, "please tell us why"),
  reason_details: z.string().max(500).optional(),
  how_heard: z.string().min(1, "please tell us how you heard about us"),
  company_domain: z.string().max(100).optional(),
  desired_domain: z.string().max(100).optional(),
});

type EarlyAccessForm = z.infer<typeof earlyAccessSchema>;

interface EarlyAccessStepFormProps {
  onSuccess: (data: { id: string; referral_code: string }) => void;
  prefillEmail?: string | null;
}

export const EarlyAccessStepForm = ({ onSuccess, prefillEmail }: EarlyAccessStepFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    watch,
  } = useForm<EarlyAccessForm>({
    resolver: zodResolver(earlyAccessSchema),
    mode: "onChange",
  });

  // Pre-fill email if provided from URL parameter
  useState(() => {
    if (prefillEmail) {
      setValue('email', prefillEmail);
    }
  });

  const role = watch("role");
  const team_size = watch("team_size");
  const reason_for_joining = watch("reason_for_joining");
  const how_heard = watch("how_heard");

  const handleNext = async () => {
    let fieldsToValidate: (keyof EarlyAccessForm)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ["name", "email"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["role", "team_size", "reason_for_joining"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data: EarlyAccessForm) => {
    setIsSubmitting(true);

    try {
      const referredBy = searchParams.get("ref");

      const { data: responseData, error } = await supabase.functions.invoke(
        "submit-early-access",
        {
          body: {
            name: data.name,
            email: data.email,
            team_size: data.team_size,
            role: data.role,
            reason_for_joining: data.reason_for_joining,
            reason_details: data.reason_details || null,
            how_heard: data.how_heard,
            company_domain: data.company_domain || null,
            desired_domain: data.desired_domain || null,
            referred_by: referredBy,
          },
        }
      );

      if (error) throw error;

      onSuccess({
        id: responseData.id,
        referral_code: responseData.referral_code,
      });

      toast({
        title: "you're on the list",
        description: "check your email for next steps",
      });
    } catch (error: any) {
      console.error("Error submitting early access:", error);
      toast({
        title: "something went wrong",
        description: error.message || "please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(0);

  const handleStepChange = (newStep: number) => {
    setDirection(newStep > currentStep ? 1 : -1);
    setCurrentStep(newStep);
  };

  return (
    <div className="relative">
      {/* Radial glow behind card */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-40 blur-3xl pointer-events-none" />
      
      {/* Premium gradient card container */}
      <div className="relative bg-gradient-to-br from-white via-white to-muted/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/30 p-6 md:p-8 hover:border-primary/20 transition-all duration-500">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Animated Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">
                step {currentStep} of 3
              </span>
              <span className="text-primary font-semibold">
                {Math.round((currentStep / 3) * 100)}%
              </span>
            </div>
            <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${(currentStep / 3) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-transparent rounded-full opacity-50"
                initial={{ width: "0%" }}
                animate={{ width: `${(currentStep / 3) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="relative min-h-[280px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl font-display font-semibold">
                      let's start simple
                    </h3>

                    <div className="space-y-3">
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Label htmlFor="name">your full name</Label>
                        <Input
                          id="name"
                          placeholder="john doe"
                          {...register("name")}
                          className="h-11 focus:scale-[1.02] transition-transform duration-200"
                        />
                        {errors.name && (
                          <p className="text-sm text-destructive">
                            {errors.name.message}
                          </p>
                        )}
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label htmlFor="email">email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@company.com"
                          {...register("email")}
                          className="h-11 focus:scale-[1.02] transition-transform duration-200"
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">
                            {errors.email.message}
                          </p>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <div className="space-y-4">
                    <h3 className="text-2xl font-display font-semibold">
                      tell us about you
                    </h3>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="role">your role</Label>
                        <Select
                          value={role}
                          onValueChange={(value) => setValue("role", value)}
                        >
                          <SelectTrigger id="role" className="h-11">
                            <SelectValue placeholder="select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="marketing">marketing</SelectItem>
                            <SelectItem value="sales">sales</SelectItem>
                            <SelectItem value="marketing_ops">
                              marketing ops
                            </SelectItem>
                            <SelectItem value="developer">developer</SelectItem>
                            <SelectItem value="partner_manager">
                              partner manager
                            </SelectItem>
                            <SelectItem value="agency">agency</SelectItem>
                            <SelectItem value="other">other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.role && (
                          <p className="text-sm text-destructive">
                            {errors.role.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="team_size">team size</Label>
                        <Select
                          value={team_size}
                          onValueChange={(value) => setValue("team_size", value)}
                        >
                          <SelectTrigger id="team_size" className="h-11">
                            <SelectValue placeholder="select team size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="just_me">just me</SelectItem>
                            <SelectItem value="2-10">2-10</SelectItem>
                            <SelectItem value="11-50">11-50</SelectItem>
                            <SelectItem value="51-200">51-200</SelectItem>
                            <SelectItem value="201-500">201-500</SelectItem>
                            <SelectItem value="500+">500+</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.team_size && (
                          <p className="text-sm text-destructive">
                            {errors.team_size.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reason_for_joining">why utm.one?</Label>
                        <Select
                          value={reason_for_joining}
                          onValueChange={(value) =>
                            setValue("reason_for_joining", value)
                          }
                        >
                          <SelectTrigger id="reason_for_joining" className="h-11">
                            <SelectValue placeholder="what brings you here" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="link_management">
                              link management
                            </SelectItem>
                            <SelectItem value="utm_tracking">
                              utm tracking
                            </SelectItem>
                            <SelectItem value="qr_codes">qr codes</SelectItem>
                            <SelectItem value="analytics">analytics</SelectItem>
                            <SelectItem value="team_governance">
                              team governance
                            </SelectItem>
                            <SelectItem value="all_of_the_above">
                              all of the above
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.reason_for_joining && (
                          <p className="text-sm text-destructive">
                            {errors.reason_for_joining.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-2">
                      <h3 className="text-2xl font-display font-semibold">
                        almost there
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        you're one click away from the early circle
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="how_heard">how did you hear about us?</Label>
                        <Select
                          value={how_heard}
                          onValueChange={(value) => setValue("how_heard", value)}
                        >
                          <SelectTrigger id="how_heard" className="h-11">
                            <SelectValue placeholder="select one" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="google_search">
                              google search
                            </SelectItem>
                            <SelectItem value="social_media">
                              social media
                            </SelectItem>
                            <SelectItem value="referral">referral</SelectItem>
                            <SelectItem value="product_hunt">
                              product hunt
                            </SelectItem>
                            <SelectItem value="blog">blog</SelectItem>
                            <SelectItem value="podcast">podcast</SelectItem>
                            <SelectItem value="other">other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.how_heard && (
                          <p className="text-sm text-destructive">
                            {errors.how_heard.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reason_details">
                          tell us more{" "}
                          <span className="text-muted-foreground">(optional)</span>
                        </Label>
                        <Textarea
                          id="reason_details"
                          placeholder="anything else we should know?"
                          {...register("reason_details")}
                          className="min-h-[80px]"
                        />
                        {errors.reason_details && (
                          <p className="text-sm text-destructive">
                            {errors.reason_details.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
                className="hover:scale-105 transition-transform duration-200"
              >
                ← back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-[hsl(20_100%_51%)] hover:bg-[hsl(20_80%_45%)] text-white hover:scale-105 transition-transform duration-200"
              >
                next →
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 bg-gradient-to-r from-[hsl(20_100%_51%)] to-[hsl(20_80%_45%)] hover:from-[hsl(20_80%_45%)] hover:to-[hsl(20_100%_51%)] text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? "submitting..." : "🚀 request early access"}
                </span>
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};