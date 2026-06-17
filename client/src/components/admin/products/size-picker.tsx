import { Label } from "@/components/ui/label";
import { SIZE_OPTIONS } from "@/features/admin/products/constants";
import { cn } from "@/lib/utils";

type SizePickerProps = {
  sizes: string[];
  onToggle: (size: string) => void;
};

export function SizePicker({
  sizes,
  onToggle,
}: SizePickerProps) {
  return (
    <div className="space-y-3">
      <Label>Sizes</Label>

      <div className="flex flex-wrap gap-2">
        {SIZE_OPTIONS.map((size) => {
          const active = sizes.includes(size);

          return (
            <button
              key={size}
              type="button"
              onClick={() => onToggle(size)}
              className={cn(
                "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-all",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-muted"
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}