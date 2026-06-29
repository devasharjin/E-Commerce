import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

type PromoToolbarProps = {
  openCreateDialog: () => void;
  search: string;
  setSearch: (search: string) => void;
};

const PromoToolbar = ({
  openCreateDialog,
  search,
  setSearch,
}: PromoToolbarProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search promo code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Button
        onClick={openCreateDialog}
        className="w-full sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        Add Promo
      </Button>
    </div>
  );
};

export default PromoToolbar;