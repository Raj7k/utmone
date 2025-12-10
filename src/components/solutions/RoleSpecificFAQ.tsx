import { FAQAccordion } from "@/components/resources/FAQAccordion";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

interface RoleSpecificFAQProps {
  role: string;
  faqs: FAQItem[];
}

export const RoleSpecificFAQ = ({ role, faqs }: RoleSpecificFAQProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
          questions from {role}
        </h2>
        <p className="text-lg text-white/60 font-sans">
          real questions we've answered for teams like yours
        </p>
      </div>
      
      <FAQAccordion items={faqs} />
    </div>
  );
};
