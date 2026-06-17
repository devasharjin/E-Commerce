import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createAdminCategory, updateAdminCategory } from "@/features/admin/products/api";
import type { Category } from "@/features/admin/products/type";
import { Pencil, Tag } from "lucide-react";
import { useState } from "react";



type CategoryDialogProps = {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    categories: Category[],
    onSaved: () => Promise<void>
}

export function CategoryDialog({
    open,
    onOpenChange,
    categories,
    onSaved
}: CategoryDialogProps) {

    const [name, setName] = useState('')
    const [exitingCategory, setExistingCategory] = useState<Category | null>(null)
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        if (!name.trim()) return
        try {
            setSaving(true)
            if (exitingCategory) {
                await updateAdminCategory(exitingCategory._id, { name })

            } else {
                await createAdminCategory({ name: name.trim() })
            }

            setName('')
            setExistingCategory(null)
            await onSaved()

        } finally {
            setName('')
            setSaving(false)
        }
    }

    const handleEdit = async (category: Category) => {
        setName('')
        setExistingCategory(category)
        setName(category.name)
    }

    function handleclose(nextOpen: boolean) {
        if (!nextOpen) {
            setName("")
            setExistingCategory(null)
        }
        onOpenChange(nextOpen)
    }

    return <div>
        <Dialog open={open} onOpenChange={handleclose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Categories</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="flex gap-2">
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Category name"
                        />

                        <Button
                            onClick={handleSave}
                            disabled={!name.trim() || saving}
                        >
                            {exitingCategory ? "Update" : "Add"}
                        </Button>
                    </div>

                    <div className="space-y-1">
                        {categories.map((cat) => (
                            <div
                                key={cat._id}
                                className="group flex items-center justify-between rounded-md px-2 py-2 hover:bg-muted/50"
                            >
                                <div className="flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                    <span>{cat.name}</span>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEdit(cat)}
                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
}