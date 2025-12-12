import { useState, useEffect } from "react";
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
import { notify } from "@/lib/notify";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, ArrowLeft, Sparkles, Check, AlertCircle } from "lucide-react";
import { validateEmailSmart } from "@/lib/emailValidator";

const LOADING_STEPS = [
  "verifying your email...",
  "reserving your spot...",
  "calculating your position...",
  "preparing your golden ticket...",
  "almost there..."
];

const earlyAccessSchema = z.object({
  name: z.string().min(1, "name is required").max(100),
  email: z.string()
    .email("please enter a valid email")
    .max(255)
    .refine((email) => {
      const result = validateEmailSmart(email);
      return result.isValid;
    }, (email) => {
      const result = validateEmailSmart(email);
      return { message: result.error || "please enter a valid email" };
    }),
  team_size: z.string().min(1, "please select team size"),
  reason_for_joining: z.string().optional(),
});

type EarlyAccessForm = z.infer<typeof earlyAccessSchema>;

interface EarlyAccessStepFormProps {
  onSuccess: (data: { 
    id: string; 
    referral_code: string; 
    name: string;
    position: number;
    email: string;
  }) => void;
  prefillEmail?: string | null;
}

export const EarlyAccessStepForm = ({ onSuccess, prefillEmail }: EarlyAccessStepFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [emailValidation, setEmailValidation] = useState<{ isValid: boolean; error?: string; suggestion?: string } | null>(null);
  const [searchParams] = useSearchParams();

  // Cycle through loading steps while submitting
  useEffect(() => {
    if (!isSubmitting) {
      setLoadingStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => 
        prev < LOADING_STEPS.length - 1 ? prev + 1 : prev
      );
    }, 700);

    return () => clearInterval(interval);
  }, [isSubmitting]);

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
    defaultValues: {
      email: prefillEmail || "",
    },
  });

  const team_size = watch("team_size");
  const reason_for_joining = watch("reason_for_joining");

  const handleNext = async () => {
    const isValid = await trigger(["name", "email"]);
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const onSubmit = async (data: EarlyAccessForm) => {
    setIsSubmitting(true);

    try {
      const referredByCode = searchParams.get("ref");

      const { data: responseData, error } = await supabase.functions.invoke(
        "handle-referral-signup",
        {
          body: {
            name: data.name,
            email: data.email,
            team_size: data.team_size,
            reason_for_joining: data.reason_for_joining || "Not specified",
            referral_code: referredByCode || undefined,
          },
        }
      );

      if (error) throw error;

      // Call onSuccess with full data immediately
      onSuccess({
        id: responseData.id,
        referral_code: responseData.referral_code,
        name: data.name,
        position: responseData.position || 0,
        email: data.email,
      });

    } catch (error: any) {
      console.error("Error submitting early access:", error);
      notify.error(error.message || "please try again");
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
      {/* Full-screen loading overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            {/* Breathing pulse bar */}
            <motion.div
              className="w-24 h-1 rounded-full bg-foreground shadow-[0_0_12px_hsl(var(--foreground)/0.4)]"
              animate={{
                opacity: [0.3, 1, 0.3],
                scaleX: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
            
            {/* Cycling status text */}
            <div className="mt-8 h-6">
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingStepIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="text-muted-foreground text-sm font-mono tracking-wide"
                >
                  {LOADING_STEPS[loadingStepIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="mt-6 flex gap-2">
              {LOADING_STEPS.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    index <= loadingStepIndex ? 'bg-foreground' : 'bg-muted'
                  }`}
                  animate={index === loadingStepIndex ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Radial glow behind card */}
      <div className="absolute inset-0 opacity-40 blur-3xl pointer-events-none bg-[radial-gradient(circle,hsl(var(--primary)/0.2),transparent)]" />
      
      {/* Premium gradient card container */}
      <div className="relative backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 transition-all duration-500 bg-card border border-border">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Animated Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-muted-foreground">
                step {currentStep} of 2
              </span>
              <span className="font-semibold text-primary">
                {Math.round((currentStep / 2) * 100)}%
              </span>
            </div>
            <div className="relative h-2 rounded-full overflow-hidden bg-muted">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-primary/60"
                initial={{ width: "0%" }}
                animate={{ width: `${(currentStep / 2) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full opacity-50 bg-gradient-to-r from-primary/50 to-transparent"
                initial={{ width: "0%" }}
                animate={{ width: `${(currentStep / 2) * 100}%` }}
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
                        <div className="relative">
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@company.com"
                            {...register("email", {
                              onChange: (e) => {
                                const result = validateEmailSmart(e.target.value);
                                setEmailValidation(result);
                              }
                            })}
                            className={`h-11 focus:scale-[1.02] transition-transform duration-200 pr-10 ${
                              emailValidation?.isValid ? 'border-green-500' :
                              emailValidation?.error ? 'border-red-500' : ''
                            }`}
                          />
                          {emailValidation?.isValid && (
                            <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                          )}
                          {emailValidation?.error && !emailValidation?.isValid && (
                            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                          )}
                        </div>
                        {emailValidation?.suggestion && (
                          <button
                            type="button"
                            onClick={() => {
                              setValue("email", emailValidation.suggestion!);
                              setEmailValidation({ isValid: true });
                            }}
                            className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
                          >
                            {emailValidation.error} <span className="font-medium">click to fix</span>
                          </button>
                        )}
                        {errors.email && !emailValidation?.suggestion && (
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
                    <div className="text-center mb-2">
                      <h3 className="text-2xl font-display font-semibold">
                        quick context
                      </h3>
                      <p className="text-sm mt-1 text-muted-foreground">
                        helps us personalize your experience
                      </p>
                    </div>

                    <div className="space-y-3">
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
                        <Label htmlFor="reason_for_joining">
                          what brings you to utm.one?{" "}
                          <span className="text-muted-foreground/50">(optional)</span>
                        </Label>
                        <Textarea
                          id="reason_for_joining"
                          placeholder="tell us briefly about your use case..."
                          {...register("reason_for_joining")}
                          className="min-h-[80px]"
                        />
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
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            {currentStep > 1 ? (
              <Button
                type="button"
                onClick={handleBack}
                variant="ghost"
                size="lg"
                className="group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 2 ? (
              <Button
                type="button"
                onClick={handleNext}
                size="lg"
                variant="marketing"
                className="group ml-auto"
              >
                continue
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                variant="marketing"
                className="group ml-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    joining...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    join waitlist
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
