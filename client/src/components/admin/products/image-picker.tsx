import { ImagePlus, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProductImage } from "@/features/admin/products/type";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";


type ImagePickerProps = {
  existingImages: ProductImage[],
  newFiles: File[],
  coverImagePublicId: string
  onAddFile: (file: FileList | null) => void
  onRemoveExistingImages: (publicId: string) => void
  onChangeCoverImage: (publicId: string) => void
}

export function ImagePicker({
  existingImages,
  newFiles,
  coverImagePublicId,
  onAddFile,
  onRemoveExistingImages,
  onChangeCoverImage
}: ImagePickerProps) {

  type PreviewTypes = {
    file: File,
    preview: string
  }
  const [previews, setPreview] = useState<PreviewTypes[]>([])

  useEffect(() => {
    const urls = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    setPreview(urls)

    return () => {
      urls.forEach((item) => {
        URL.revokeObjectURL(item.preview)
      })
    }
  }, [newFiles])

  return (
   <div className="space-y-4">
  <div>
    <Label className="text-sm font-semibold">
      Images
    </Label>
  </div>

  <label
  htmlFor="product-images"
  className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-background px-4 hover:bg-muted/50"
>
  <ImagePlus className="h-4 w-4" />

  <span className="text-sm font-medium">
    Add Images
  </span>

  <Input
    id="product-images"
    type="file"
    multiple
    accept="image/*"
    onChange={(e) => onAddFile(e.target.files)}
    className="hidden"
  />
</label>

  {existingImages.length > 0 && (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        Existing Images
      </p>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {existingImages.map((item) => {
          const isCover =
            coverImagePublicId === item.publicId;

          return (
            <div
              key={item.publicId}
              className="overflow-hidden rounded-xl border bg-card"
            >
              <img
                src={item.url}
                alt="product"
                className="h-28 w-full object-cover"
              />

              <div className="flex items-center justify-between gap-2 p-2">
                <Button
                  type="button"
                  size="sm"
                  variant={
                    isCover
                      ? "default"
                      : "secondary"
                  }
                  onClick={() =>
                    onChangeCoverImage(item.publicId)
                  }
                >
                  {isCover
                    ? "Cover"
                    : "Set Cover"}
                </Button>

                <Button
                  type="button"
                  size="icon"
                  
                  className="text-red-950 bg-accent hover:bg-white"
                  onClick={() =>
                    onRemoveExistingImages(
                      item.publicId
                    )
                  }
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )}

  {previews.length > 0 && (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        New Uploads
      </p>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {previews.map((item) => (
          <div
            key={`${item.file.name}-${item.file.lastModified}`}
            className="overflow-hidden rounded-xl border bg-card"
          >
            <img
              src={item.preview}
              alt={item.file.name}
              className="h-28 w-full object-cover"
            />

            <div className="p-2 text-xs text-muted-foreground truncate">
              {item.file.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>
  );
}