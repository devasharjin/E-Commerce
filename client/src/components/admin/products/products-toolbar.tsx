import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Tags } from "lucide-react";

type ToolbarProps = {
  search: string;
  onChangeSearch: (search: string) => void;
  onManageCategories: () => void;
  onAddProducts: () => void;
};

export function AdminProductToolbar({
  search,
  onChangeSearch,
  onManageCategories,
  onAddProducts,
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Search */}
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          placeholder="Search products..."
          onChange={(e) => onChangeSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="outline"
          onClick={onManageCategories}
        >
          <Tags className="h-4 w-4" />
          Categories
        </Button>

        <Button onClick={onAddProducts}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>
    </div>
  );
}