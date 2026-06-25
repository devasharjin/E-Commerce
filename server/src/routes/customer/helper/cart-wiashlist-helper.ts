import type { Types } from "mongoose"
import Cart from "../../../models/cart.js"
import { AppError } from "../../../utils/AppError.js"
import Wishlist from "../../../models/wishlist.js"


export type ProductSize = 'S' | 'M' | 'L' | 'XL'

export type ProductPreview = {
    _id: string,
    title: string,
    brand: string,
    category: string,
    price: number,
    salesPercentage: number,
    images: Array<{
        url: string,
        isCover: boolean
    }>

}

export type CartItem = {
    product: Types.ObjectId | ProductPreview,
    quantity: number,
    color?: string,
    size?: 'S' | 'M' | 'L' | 'XL'
}

export type SyncCartItem = {
    product?: Types.ObjectId,
    quantity?: number,
    color?: string,
    size?: 'S' | 'M' | 'L' | 'XL'
}


export function FormatProducts(product: ProductPreview) {
    const image = product.images.find(image => image.isCover)?.url ||
        product.images[0]?.url || "";

    const finalPrice = product.salesPercentage
        ? Math.round(product.price - (product.price * product.salesPercentage) / 100)
        : product.price;

    return {
        id: String(product._id),
        title: product.title,
        Category: product.category,
        brand: product.brand,
        image,
        price: finalPrice
    }

}

export async function getCartResponse(userId: string) {
    const cart = await Cart.findOne({ user: userId }).populate('items.product')

    const cartItems = cart?.items || []

    const items = cartItems.map((item: CartItem) => {
        return {
            ...FormatProducts(item.product as ProductPreview),
            quantity: item.quantity,
            size: item.size,
            color: item.color
        }
    })

    const totalQuantity = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );
    return {
        items,
        totalQuantity
    }

}

export async function getWishlistResponse(userId: string) {
    const wishlist = await Wishlist.findOne({ user: userId }).populate('products')

    const cartItems= wishlist?.products || []

    const items = cartItems.map((item) => {
        return{
            ...FormatProducts(item as unknown as ProductPreview),
        }
    })
    return items
}

export function selectedVariant(
    product: { sizes: ProductSize[], colors: string[] },
    colorValue: string,
    sizeValue: ProductSize
) {
    let size: ProductSize | undefined;
    let color: string | undefined

    if (product.colors.length > 0) {
        if (!colorValue) {
            throw new AppError(400, 'Color Value is required.')
        }
        if (!product.colors.includes(colorValue)) {
            throw new AppError(400, 'Color Value is invalid.')
        }
        color = colorValue


    }
    if (product.sizes.length > 0) {
        if (!sizeValue) {
            throw new AppError(400, 'sizes Value is required.')
        }
        if (!product.sizes.includes(sizeValue as ProductSize)) {
            throw new AppError(400, 'sizes Value is invalid.')
        }
        size = sizeValue as ProductSize
    }
    return {
        color, size
    }
}

export function checkSameProduct(
    item: CartItem,
    productId: string,
    color?: string,
    size?: string
) {
    return (
        String(item.product) === productId &&
        (item.color || "") === (color || "") &&
        (item.size || "") === (size || "")
    )

}