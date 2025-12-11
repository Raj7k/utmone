import { motion } from 'framer-motion';
import { categories, ArchitectCategory } from '@/data/b2bArchitects';

interface CategoryFilterProps {
  selected: ArchitectCategory | 'all';
  onSelect: (category: ArchitectCategory | 'all') => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const allCategories = [
    { key: 'all' as const, label: 'Show All', icon: '✨' },
    ...Object.entries(categories).map(([key, value]) => ({
      key: key as ArchitectCategory,
      label: value.label,
      icon: value.icon,
    })),
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
      {allCategories.map((category) => (
        <motion.button
          key={category.key}
          onClick={() => onSelect(category.key)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${selected === category.key
              ? 'bg-gray-900 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <span className="flex items-center gap-2">
            <span>{category.icon}</span>
            <span className="hidden sm:inline">{category.label}</span>
          </span>
          {selected === category.key && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 bg-gray-900 rounded-full -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
