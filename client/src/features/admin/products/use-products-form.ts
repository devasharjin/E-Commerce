import { useEffect, useState } from "react"
import type { Product, ProductFormState, ProductImage } from "./type"
import { createAdminProduct, updateAdminProduct } from "./api"




type HandleProductFormProps = {
    open: boolean,
    onClose: () => void,
    onSaved: () => Promise<void>,
    product: Product | null
}

export function getEmptyForm(): ProductFormState {
    return {
        title: '',
        description: '',
        brand: '',
        category: '',
        colors: [],
        sizes: [],
        status: 'active',
        price: '',
        stock: '',
        salePercentage: '',
        existingImages: [],
        newFiles: [],
        coverImagePublicId: ""

    }
}

export function getCoverImage(images: ProductImage[] = []) {
    return images.find((img) => img.isCover) ?? images[0]
}

export function mapProductToFormValues(product: Product): ProductFormState {
    const cover = getCoverImage(product.images)
    return {
        title: product.title,
        description: product.description,
        brand: product.brand,
        category:
            typeof product.category === "string"
                ? product.category
                : product.category._id,
        colors: product.colors,
        sizes: product.sizes,
        status: product.status,
        price: String(product.price),
        stock: String(product.stock),
        salePercentage: String(product.salePercentage),
        existingImages: product.images,
        newFiles: [],
        coverImagePublicId: cover.publicId
    }
}

export function useProductForm({
    open,
    onClose,
    onSaved,
    product
}: HandleProductFormProps) {
    const [form, setForm] = useState<ProductFormState>(getEmptyForm())
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        setForm(product ? mapProductToFormValues(product) : getEmptyForm())
    }, [open, product])

    function toggleSize(size: string) {
        setForm((prev) => ({
            ...prev,
            sizes: prev.sizes.includes(size) ?
                prev.sizes.filter((item) => item !== size) : [...prev.sizes, size]
        }))
    }

    function addColor(color: string) {
        setForm((prev) => ({
            ...prev,
            colors: prev.colors.includes(color) ?
                prev.colors : [...prev.colors, color]
        }))
    }

    function removeColor(color: string) {
        setForm((prev) => ({
            ...prev,
            colors: prev.colors.filter((item) => item !== color)
        }))
    }

    function addFiles(files: FileList | null) {
        if (!files?.length) return;

        setForm((prev) => ({
            ...prev,
            newFiles: [...prev.newFiles, ...Array.from(files)]
        }))
    }

    function updateField<K extends keyof ProductFormState>(
        key: K,
        value: ProductFormState[K]
    ) {
        setForm((prev) => ({
            ...prev,
            [key]: value
        }))
    }

    function removeExistingImages(publicId: string) {
        setForm((prev) => {
            const nextImages = prev.existingImages.filter(
                (img) => img.publicId !== publicId
            );

            const coverImagePublicId =
                prev.coverImagePublicId === publicId
                    ? nextImages[0]?.publicId ?? ""
                    : prev.coverImagePublicId;

            return {
                ...prev,
                existingImages: nextImages,
                coverImagePublicId,
            };
        });
    }

    function changeCoverImage(publicId: string) {
        updateField('coverImagePublicId', publicId)
    }

    async function submit() {
        if (!form.title.trim() || !form.description.trim())
            return
        try {
            setSaving(true)

            if (product) {
                await updateAdminProduct(
                    product._id,
                    {
                        title: form.title.trim(),
                        description: form.description.trim(),
                        category: form.category,
                        brand: form.brand,
                        colors: form.colors,
                        sizes: form.sizes,
                        price: Number(form.price),
                        salePercentage: Number(form.salePercentage) || 0,
                        stock: Number(form.stock),
                        status: form.status,
                        existingImages: form.existingImages,
                        coverImagePublicId: form.coverImagePublicId || undefined,
                    },
                    form.newFiles,
                )
            } else {
                await createAdminProduct({
                    title: form.title.trim(),
                    description: form.description.trim(),
                    category: form.category,
                    brand: form.brand,
                    colors: form.colors,
                    sizes: form.sizes,
                    price: Number(form.price),
                    salePercentage: Number(form.salePercentage) || 0,
                    stock: Number(form.stock),
                    status: form.status,
                }, form.newFiles)
            }
            await onSaved()
            onClose()
        } finally {
            setSaving(false)
        }
    }

    return {
        form,
        saving,
        isEditMode: !!product,
        toggleSize,
        addColor,
        removeColor,
        addFiles,
        submit,
        updateField,
        removeExistingImages,
        changeCoverImage
    };
}