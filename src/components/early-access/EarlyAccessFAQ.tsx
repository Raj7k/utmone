import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "what do i get for joining?",
    answer: "early access + a free pro month when you unlock via referrals.",
  },
  {
    question: "how do referrals work?",
    answer: "share your unique link. every valid signup counts.",
  },
  {
    question: "what makes a referral invalid?",
    answer: "same IP/device, fake emails, duplicates, bots.",
  },
  {
    question: "do my friends get anything?",
    answer: "yes, they get 1 free pro month too.",
  },
  {
    question: "how do i skip the line?",
    answer: "refer 3 people. your dashboard updates instantly.",
  },
];

export function EarlyAccessFAQ() {
  return (
    <section className="bg-white py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
            frequently asked questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-secondary-label text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
