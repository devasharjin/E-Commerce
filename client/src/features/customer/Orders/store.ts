import { create } from "zustand";

type storeType = {
  isOpen  : boolean,
  setOpen : (value : boolean)=>void
}

export const useOrderStore = create<storeType>((set,get)=>({
  isOpen : false,
  setOpen : (value)=>set({isOpen : value})
}))