import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { pakistanCities, eventCategories } from '@/data/mockEvents';
import { motion } from 'framer-motion';

interface EventFiltersProps {
  searchQuery: string;
  selectedCity: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export const EventFilters = ({
  searchQuery,
  selectedCity,
  selectedCategory,
  onSearchChange,
  onCityChange,
  onCategoryChange
}: EventFiltersProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-6 shadow-card space-y-4"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select value={selectedCity} onValueChange={onCityChange}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            {pakistanCities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {eventCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};
