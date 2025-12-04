import { motion } from "framer-motion";
import { Mail, ArrowRight, Shield, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export const JustInTimeProvisioningVisual = () => {
  const steps = [
    {
      icon: Mail,
      title: "User signs up",
      description: "john@nike.com creates account",
      color: "text-blazeOrange"
    },
    {
      icon: Shield,
      title: "Auto-captured",
      description: "Automatically added to Nike workspace",
      color: "text-[#3B82F6]"
    },
    {
      icon: CheckCircle2,
      title: "Assigned role",
      description: "Given 'Viewer' role until approved",
      color: "text-green-500"
    }
  ];

  return (
    <div className="relative">
      <Card className="p-8 md:p-12 bg-card border-2 border-border">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 rounded-2xl" style={{ background: 'rgba(59,130,246,0.1)' }}>
            <Shield className="w-8 h-8" style={{ color: 'rgba(59,130,246,1)' }} />
          </div>
          <div>
            <h3 className="text-2xl font-display font-bold text-label lowercase">
              just-in-time provisioning
            </h3>
            <p className="text-sm text-secondary-label">
              automatic workspace capture via SSO domain
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted/50 border-2 border-border mb-4">
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>
                <h4 className="font-display font-bold text-label lowercase mb-2">
                  {step.title}
                </h4>
                <p className="text-sm text-secondary-label">{step.description}</p>
              </motion.div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%]">
                  <ArrowRight className="w-6 h-6 text-muted-foreground/30" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 rounded-xl border" style={{ background: 'linear-gradient(to bottom right, rgba(255,107,0,0.1), rgba(59,130,246,0.1))', borderColor: 'rgba(59,130,246,0.2)' }}>
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: 'rgba(59,130,246,1)' }} />
            <div>
              <h4 className="font-semibold text-label mb-2 lowercase">prevents shadow it</h4>
              <p className="text-sm text-secondary-label">
                No more rogue accounts. When employees sign up with company emails, they're 
                automatically captured into the right workspace with secure default permissions. 
                Admins maintain full visibility and control.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-muted/50">
            <div className="text-2xl font-bold" style={{ color: 'rgba(59,130,246,1)' }}>100%</div>
            <div className="text-xs text-secondary-label">Capture Rate</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-muted/50">
            <div className="text-2xl font-bold" style={{ color: 'rgba(59,130,246,1)' }}>0</div>
            <div className="text-xs text-secondary-label">Shadow Accounts</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-muted/50">
            <div className="text-2xl font-bold" style={{ color: 'rgba(59,130,246,1)' }}>&lt;30s</div>
            <div className="text-xs text-secondary-label">Provisioning Time</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
