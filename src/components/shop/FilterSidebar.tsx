import { categories, manufacturers } from "../../data/mock";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

export function FilterSidebar() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold text-lg mb-4">Filters</h3>
        <Button variant="outline" className="w-full text-xs h-8">Clear All</Button>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-sm text-slate-900">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center space-x-2">
              <input type="checkbox" id={`cat-${cat}`} className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4" />
              <Label htmlFor={`cat-${cat}`} className="text-sm font-normal cursor-pointer text-slate-600">
                {cat}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 border-t pt-6">
        <h4 className="font-medium text-sm text-slate-900">Manufacturer</h4>
        <div className="space-y-2">
          {manufacturers.slice(0, 5).map((mfg) => (
            <div key={mfg} className="flex items-center space-x-2">
              <input type="checkbox" id={`mfg-${mfg}`} className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4" />
              <Label htmlFor={`mfg-${mfg}`} className="text-sm font-normal cursor-pointer text-slate-600">
                {mfg}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 border-t pt-6">
        <h4 className="font-medium text-sm text-slate-900">Price Range</h4>
        <div className="flex items-center space-x-2">
          <Input type="number" placeholder="Min" className="h-9" />
          <span className="text-slate-400">-</span>
          <Input type="number" placeholder="Max" className="h-9" />
        </div>
      </div>
    </div>
  );
}
