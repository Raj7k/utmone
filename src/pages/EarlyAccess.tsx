import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AnimatedHeadline } from "@/components/landing/AnimatedHeadline";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  name: z.string()
    .min(2, "name must be at least 2 characters")
    .max(100, "name must be less than 100 characters"),
  email: z.string()
    .email("please enter a valid email address")
    .max(255, "email must be less than 255 characters"),
  team_size: z.string()
    .min(1, "please select your team size"),
  company_domain: z.string()
    .optional()
    .refine((val) => !val || /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/.test(val), {
      message: "please enter a valid domain (e.g., company.com)"
    })
});

type FormData = z.infer<typeof formSchema>;

const BenefitCard = ({ number, title, description, delay = 0 }: { number: string; title: string; description: string; delay?: number }) => (
  <AnimatedHeadline delay={delay}>
    <div className="relative bg-white rounded-2xl p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.10)] transition-all duration-300">
      <div className="absolute top-6 right-6 text-7xl font-extrabold text-foreground/5 pointer-events-none">
        {number}
      </div>
      <div className="relative z-10">
        <h3 className="text-2xl md:text-3xl font-semibold mb-4">{title}</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  </AnimatedHeadline>
);

export default function EarlyAccess() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      team_size: "",
      company_domain: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    // Insert the request into database
    const { data: insertedData, error } = await supabase
      .from('early_access_requests')
      .insert({
        name: data.name,
        email: data.email,
        team_size: data.team_size,
        company_domain: data.company_domain || null
      })
      .select()
      .single();

    if (error) {
      console.error('Early access request error:', error);
      toast.error("something went wrong. please try again.");
      setIsSubmitting(false);
      return;
    }

    // Send admin notification email
    try {
      const { error: emailError } = await supabase.functions.invoke('notify-admin-new-request', {
        body: {
          request_id: insertedData.id,
          name: data.name,
          email: data.email,
          team_size: data.team_size,
          company_domain: data.company_domain || null
        }
      });

      if (emailError) {
        console.error('Email notification error:', emailError);
        // Don't fail the submission if email fails
      }
    } catch (emailError) {
      console.error('Email notification error:', emailError);
      // Don't fail the submission if email fails
    }

    setIsSubmitted(true);
    toast.success("request submitted successfully!");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white py-32 px-6">
        <div className="max-w-[900px] mx-auto text-center">
          <AnimatedHeadline>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold mb-8 leading-tight">
              welcome to the early circle.
            </h1>
          </AnimatedHeadline>
          <AnimatedHeadline delay={200}>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              utm.one is launching in phases — and early access is limited to teams who want clarity from day one.
            </p>
          </AnimatedHeadline>
        </div>
      </section>

      {/* Why Invite-Only Section */}
      <section className="bg-muted/20 py-40 px-6">
        <div className="max-w-[800px] mx-auto">
          <AnimatedHeadline>
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
              why invite-only?
            </h2>
          </AnimatedHeadline>
          <AnimatedHeadline delay={200}>
            <div className="space-y-8 text-lg md:text-xl text-muted-foreground leading-relaxed">
              <p>
                we're designing utm.one with the same care we bring to the product itself.
                every feature is tested, refined, and perfected with a small group of early users.
              </p>
              <p className="font-medium text-foreground">this ensures:</p>
              <ul className="space-y-4 pl-6">
                <li className="flex items-start">
                  <span className="mr-3 text-foreground">•</span>
                  <span>cleaner workflows</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-foreground">•</span>
                  <span>tighter governance</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-foreground">•</span>
                  <span>smoother integrations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-foreground">•</span>
                  <span>stronger analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-foreground">•</span>
                  <span>flawless branding</span>
                </li>
              </ul>
              <p>before we open the doors wider.</p>
            </div>
          </AnimatedHeadline>
        </div>
      </section>

      {/* What Early Access Gives You Section */}
      <section className="bg-white py-40 px-6">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedHeadline>
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
              what early access gives you
            </h2>
          </AnimatedHeadline>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BenefitCard
              number="01"
              title="priority onboarding"
              description="hands-on setup for domains, UTMs, and rules."
              delay={0}
            />
            <BenefitCard
              number="02"
              title="early product access"
              description="new features unlocked before public launch."
              delay={100}
            />
            <BenefitCard
              number="03"
              title="influence on roadmap"
              description="your input shapes the product."
              delay={200}
            />
            <BenefitCard
              number="04"
              title="direct access to our team"
              description="ops, design, engineering — line of sight."
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* Who We're Selecting Section */}
      <section className="bg-muted/20 py-32 px-6">
        <div className="max-w-[800px] mx-auto">
          <AnimatedHeadline>
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
              who we're selecting
            </h2>
          </AnimatedHeadline>
          <AnimatedHeadline delay={200}>
            <div className="space-y-8 text-lg md:text-xl text-muted-foreground leading-relaxed">
              <p className="text-center">teams that value:</p>
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-foreground flex-shrink-0" />
                  <span>disciplined UTMs</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-foreground flex-shrink-0" />
                  <span>branded links</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-foreground flex-shrink-0" />
                  <span>qr code quality</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-foreground flex-shrink-0" />
                  <span>clean analytics</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-foreground flex-shrink-0" />
                  <span>enterprise governance</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-foreground flex-shrink-0" />
                  <span>high-clarity marketing</span>
                </div>
              </div>
              <p className="text-center mt-8">if that's you, you're in the right place.</p>
            </div>
          </AnimatedHeadline>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-white py-40 px-6">
        <div className="max-w-[600px] mx-auto">
          {!isSubmitted ? (
            <>
              <AnimatedHeadline>
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                  join the early circle
                </h2>
              </AnimatedHeadline>
              <AnimatedHeadline delay={200}>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium lowercase">name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="your full name"
                              className="h-12 rounded-lg"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium lowercase">email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@company.com"
                              className="h-12 rounded-lg"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="team_size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium lowercase">team size</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-lg">
                                <SelectValue placeholder="select team size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-10">1-10</SelectItem>
                              <SelectItem value="11-50">11-50</SelectItem>
                              <SelectItem value="51-200">51-200</SelectItem>
                              <SelectItem value="201-1000">201-1000</SelectItem>
                              <SelectItem value="1000+">1000+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company_domain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium lowercase">company domain (optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="company.com"
                              className="h-12 rounded-lg"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-full bg-foreground text-background hover:scale-[1.02] transition-transform duration-200 text-sm font-medium lowercase"
                    >
                      {isSubmitting ? "submitting..." : "request early access"}
                    </Button>
                  </form>
                </Form>
              </AnimatedHeadline>
            </>
          ) : (
            <AnimatedHeadline>
              <div className="text-center space-y-8">
                <CheckCircle2 className="w-16 h-16 mx-auto text-foreground" />
                <h2 className="text-4xl md:text-5xl font-bold">
                  you're in the queue.
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  we'll reach out when a spot opens. check your inbox for updates.
                </p>
                <Link to="/">
                  <Button
                    variant="outline"
                    className="mt-8 h-12 px-8 rounded-full hover:scale-[1.02] transition-transform duration-200"
                  >
                    explore utm.one
                  </Button>
                </Link>
              </div>
            </AnimatedHeadline>
          )}
        </div>
      </section>

      {/* Footer Message */}
      <section className="bg-white py-12 px-6 border-t">
        <p className="text-sm text-muted-foreground text-center">
          we'll reach out when a spot opens.
        </p>
      </section>
    </div>
  );
}
