import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useState } from "react";

type ColorPickerProps = {
  colors: string[];
  onAdd: (color: string) => void;
  onRemove: (color: string) => void;
};

export function ColorPicker({
  colors,
  onAdd,
  onRemove,
}: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState("#111111");

  return (
    <div className="space-y-3">
      <Label>Colors</Label>

      <div className="flex items-center gap-2">
        <Input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="h-10 w-14 cursor-pointer p-1"
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => onAdd(selectedColor)}
        >
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onRemove(color)}
            className="group relative"
            title="Remove color"
          >
            <div
              className="h-8 w-8 rounded-full border shadow-sm transition-transform group-hover:scale-110"
              style={{ backgroundColor: color }}
            />

            <div className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full border bg-background group-hover:flex">
              <X className="h-3 w-3" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}