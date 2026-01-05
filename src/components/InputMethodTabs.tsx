import { InputMethod } from '@/types/analysis';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Type, Camera, Search } from 'lucide-react';

interface InputMethodTabsProps {
  value: InputMethod;
  onChange: (value: InputMethod) => void;
}

export function InputMethodTabs({ value, onChange }: InputMethodTabsProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as InputMethod)} className="w-full">
      <TabsList className="grid w-full grid-cols-3 h-12">
        <TabsTrigger value="text" className="flex items-center gap-2 font-medium">
          <Type size={18} />
          <span className="hidden sm:inline">Paste Text</span>
          <span className="sm:hidden">Text</span>
        </TabsTrigger>
        <TabsTrigger value="image" className="flex items-center gap-2 font-medium">
          <Camera size={18} />
          <span className="hidden sm:inline">Upload Image</span>
          <span className="sm:hidden">Image</span>
        </TabsTrigger>
        <TabsTrigger value="search" className="flex items-center gap-2 font-medium">
          <Search size={18} />
          <span className="hidden sm:inline">Search Product</span>
          <span className="sm:hidden">Search</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
