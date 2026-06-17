import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BRANDS } from "@/features/admin/products/constants";
import type { Category, Product, ProductStatus } from "@/features/admin/products/type";
import { ColorPicker } from "./color-picker";
import { SizePicker } from "./size-picker";
import { ImagePicker } from "./image-picker";
import { Button } from "@/components/ui/button";
import { useProductForm } from "@/features/admin/products/use-products-form";

type ProductDialogProps = {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  categories: Category[],
  product: Product | null,
  onSaved: () => Promise<void>
}

export function ProductDialog({
  open,
  onOpenChange,
  categories,
  product,
  onSaved
}: ProductDialogProps) {

  const {
    form,
    saving,
    isEditMode,
    updateField,
    toggleSize,
    addColor,
    removeColor,
    addFiles,
    submit,
    removeExistingImages,
    changeCoverImage
  } = useProductForm({
    open,
    onClose: () => onOpenChange(false),
    onSaved,
    product
  })

  console.log(form);


  return <Dialog open={open} onOpenChange={onOpenChange} >
    <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto space-y-4">
      <DialogTitle className="text-lg font-semibold">
        {
          isEditMode? 'Update Product' : 'Add Product'
        }
      </DialogTitle>

      <div className="space-y-4">

        {/* Title + Brand */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Title</Label>
            <Input
              placeholder="Product title"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>Brand</Label>
            <Select
              value={form.brand}
              onValueChange={(value) => updateField('brand', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>

              <SelectContent>
                {BRANDS.map((brand) => (
                  <SelectItem
                    key={brand}
                    value={brand}
                  >
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <Label>Description</Label>
          <Textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
            placeholder="Write product description..."
          />
        </div>

        {/* Category + Status */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Category</Label>

            <Select
              value={form.category}
              onValueChange={(value) => updateField('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Status</Label>

            <RadioGroup
              value={form.status}
              onValueChange={(value) => updateField('status', value as ProductStatus)}
              defaultValue="active"
              className="flex h-10 items-center gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="active"
                  id="active"
                />
                <Label htmlFor="active">
                  Active
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="inactive"
                  id="inactive"
                />
                <Label htmlFor="inactive">
                  Inactive
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label>Price</Label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) => updateField('price', e.target.value)}
              min="0"
              placeholder="0" />
          </div>

          <div className="space-y-1">
            <Label>Discount (%)</Label>
            <Input
              type="number"
              min="0"
              placeholder="0"
              value={form.salePercentage}
              onChange={(e) => updateField('salePercentage', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>Stock</Label>
            <Input
              type="number"
              min="0"
              placeholder="0"
              value={form.stock}
              onChange={(e) => updateField('stock', e.target.value)}
            />
          </div>
        </div>

        {/* Variants */}
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker colors={form.colors} onAdd={addColor} onRemove={removeColor} />
          <SizePicker sizes={form.sizes} onToggle= {toggleSize} />
        </div>

        {/* Images */}
        <div>
          <ImagePicker
              existingImages={form.existingImages} 
              newFiles={form.newFiles}
              coverImagePublicId={form.coverImagePublicId}
              onAddFile={addFiles}
              onRemoveExistingImages={removeExistingImages}
              onChangeCoverImage={changeCoverImage}
           />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button onClick={submit} disabled={saving}>
            {
              isEditMode ? 'Update Product' : 'Create Product'
            }
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
}