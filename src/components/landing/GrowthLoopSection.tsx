import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CleanTrackScoreQuiz } from "@/components/growth/CleanTrackScoreQuiz";
import { ROICalculator } from "@/components/growth/ROICalculator";
import { AnimatedSection } from "./StaticSection";
import { Calculator, ClipboardCheck } from "lucide-react";
import { preserveAcronyms as p } from "@/utils/textFormatter";

export const GrowthLoopSection = () => {
  const [activeTab, setActiveTab] = useState("quiz");

  return (
    <AnimatedSection className="py-16 md:py-24 lg:py-32 bg-transparent">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <motion.h1
            className="hero-gradient text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            how clean is your data?
          </motion.h1>
          <motion.p
            className="text-base md:text-lg max-w-2xl mx-auto text-white-50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            take our quick assessment or calculate your potential savings. share your results with your team.
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
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4" />
                data quality quiz
              </TabsTrigger>
              <TabsTrigger value="roi" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                {p("ROI calculator")}
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