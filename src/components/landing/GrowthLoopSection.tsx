import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CleanTrackScoreQuiz } from "@/components/growth/CleanTrackScoreQuiz";
import { ROICalculator } from "@/components/growth/ROICalculator";
import { AnimatedSection } from "./AnimatedSection";
import { Calculator, ClipboardCheck } from "lucide-react";

export const GrowthLoopSection = () => {
  const [activeTab, setActiveTab] = useState("quiz");

  return (
    <AnimatedSection className="py-16 md:py-24 lg:py-32 bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground lowercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            how clean is your data?
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Take our quick assessment or calculate your potential savings. Share your results with your team.
          </motion.p>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="quiz" className="flex items-center gap-2 lowercase">
                <ClipboardCheck className="w-4 h-4" />
                data quality quiz
              </TabsTrigger>
              <TabsTrigger value="roi" className="flex items-center gap-2 lowercase">
                <Calculator className="w-4 h-4" />
                roi calculator
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="quiz" className="mt-0">
              <CleanTrackScoreQuiz />
            </TabsContent>
            
            <TabsContent value="roi" className="mt-0">
              <ROICalculator />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};
