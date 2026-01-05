import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, ArrowRight } from 'lucide-react';

interface ProductSearchPanelProps {
  onSelectProduct: (ingredients: string, productName: string) => void;
}

// Sample product database for demo
const sampleProducts = [
  {
    name: "Classic Granola Bar",
    brand: "Nature Valley",
    ingredients: "Whole Grain Oats, Sugar, Canola Oil, Rice Flour, Honey, Salt, Brown Sugar Syrup, Baking Soda, Soy Lecithin, Natural Flavor"
  },
  {
    name: "Greek Yogurt",
    brand: "Chobani",
    ingredients: "Cultured Nonfat Milk, Cream, Natural Flavors, Fruit Pectin, Locust Bean Gum, Vitamin D3"
  },
  {
    name: "Almond Milk",
    brand: "Silk",
    ingredients: "Almondmilk (Filtered Water, Almonds), Cane Sugar, Vitamin and Mineral Blend (Calcium Carbonate, Vitamin E Acetate, Vitamin A Palmitate, Vitamin D2), Sea Salt, Gellan Gum, Sunflower Lecithin, Locust Bean Gum, Ascorbic Acid (to protect freshness), Natural Flavor"
  },
  {
    name: "Whole Wheat Bread",
    brand: "Dave's Killer Bread",
    ingredients: "Organic Whole Wheat Flour, Water, Organic Cracked Whole Wheat, Organic Cane Sugar, Organic Wheat Gluten, Organic Oat Fiber, Organic Molasses, Yeast, Sea Salt, Organic Cultured Wheat Flour, Organic Vinegar"
  },
  {
    name: "Energy Drink",
    brand: "Monster",
    ingredients: "Carbonated Water, Sugar, Glucose, Citric Acid, Natural Flavors, Taurine, Sodium Citrate, Color Added, Panax Ginseng Extract, L-Carnitine L-Tartrate, Caffeine, Sorbic Acid, Benzoic Acid, Niacinamide, Sucralose, Salt, D-Glucuronolactone, Inositol, Guarana Extract, Pyridoxine Hydrochloride, Riboflavin, Maltodextrin, Cyanocobalamin"
  }
];

export function ProductSearchPanel({ onSelectProduct }: ProductSearchPanelProps) {
  const [query, setQuery] = useState('');
  
  const filteredProducts = sampleProducts.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.brand.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for a product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-2">
        {(query ? filteredProducts : sampleProducts).map((product, i) => (
          <Card 
            key={i}
            className="p-4 hover:bg-secondary/50 cursor-pointer transition-colors group"
            onClick={() => onSelectProduct(product.ingredients, `${product.brand} ${product.name}`)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.brand}</p>
              </div>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={18} />
              </Button>
            </div>
          </Card>
        ))}
        
        {query && filteredProducts.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No products found. Try a different search term.
          </p>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        This is a demo database. Full product search coming soon!
      </p>
    </div>
  );
}
