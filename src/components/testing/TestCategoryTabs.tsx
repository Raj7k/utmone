import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestCategory } from "@/lib/testRunner";

interface TestCategoryTabsProps {
  activeCategory: TestCategory | 'all';
  onCategoryChange: (category: TestCategory | 'all') => void;
}

export const TestCategoryTabs = ({ activeCategory, onCategoryChange }: TestCategoryTabsProps) => {
  const categories: Array<{ value: TestCategory | 'all'; label: string }> = [
    { value: 'all', label: 'All Tests' },
    { value: 'authentication', label: 'Auth' },
    { value: 'link-management', label: 'Links' },
    { value: 'qr-codes', label: 'QR Codes' },
    { value: 'team-management', label: 'Teams' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'redirects', label: 'Redirects' },
    { value: 'api', label: 'API' },
    { value: 'database', label: 'Database' }
  ];

  return (
    <Tabs value={activeCategory} onValueChange={(val) => onCategoryChange(val as TestCategory | 'all')}>
      <TabsList className="w-full flex-wrap h-auto">
        {categories.map((cat) => (
          <TabsTrigger key={cat.value} value={cat.value} className="text-sm">
            {cat.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
