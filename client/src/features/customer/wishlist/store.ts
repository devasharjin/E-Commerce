import { create } from "zustand";


type WishlistStore = {
    isOpen : boolean,
    setOpen : (value : boolean)=>void
}

export const wishlistStore = create<WishlistStore>((set,get)=>({
    isOpen : false,
    setOpen : (value : boolean)=>set({
        isOpen : value
    })

}))