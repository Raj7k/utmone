import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReportDownloadForm } from "./ReportDownloadForm";

export const PDFDownloadSection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const benefits = [
    "Complete 100-page PDF with all data tables",
    "Printable charts and visualizations",
    "Quarterly updates sent to your inbox",
    "Access to exclusive webinar insights"
  ];

  if (isSubmitted) {
    return (
      <section id="pdf-download" className="py-24 bg-gradient-to-br from-blazeOrange/10 via-deepSea/10 to-wildSand">
        <div className="max-w-[900px] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Card className="p-12 bg-zinc-900/40 backdrop-blur-xl border border-white/10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-deepSea/10 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-deepSea" />
              </div>
              <h3 className="text-3xl font-display font-bold mb-4">
                Check Your Inbox!
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-[600px] mx-auto">
                We've sent the complete 2026 Salary Benchmark Report to your email. 
                If you don't see it in the next few minutes, check your spam folder.
              </p>
              <p className="text-sm text-muted-foreground">
                💾 You'll also receive quarterly updates as new salary data becomes available
              </p>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="pdf-download" className="py-24 bg-gradient-to-br from-blazeOrange/10 via-deepSea/10 to-wildSand">
      <div className="max-w-[1100px] mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Badge className="mb-6 bg-blazeOrange text-white text-sm px-4 py-2">
            <Download className="h-4 w-4 mr-2 inline" />
            FREE DOWNLOAD
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Download the Complete 2026 Salary Benchmark Report
          </h2>
          <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
            Get the full 100-page PDF with detailed salary tables, interactive tools, 
            and quarterly updates delivered to your inbox.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 bg-zinc-900/40 backdrop-blur-xl border border-white/10 h-full flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-8 w-8 text-deepSea" />
                <h3 className="text-2xl font-display font-bold">
                  What's Included
                </h3>
              </div>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-deepSea mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 bg-zinc-900/40 backdrop-blur-xl border border-white/10">
              <ReportDownloadForm onSuccess={() => setIsSubmitted(true)} />
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
