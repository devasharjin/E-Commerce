import { create } from "zustand";
import type { Address, AddressBodyForm } from "./types";

type AddressStoreType = {
  open: boolean;
  setOpen: (value: boolean) => void;
  isEditing: Address | null;
  setIsEditing: (address: Address | null) => void;
  form: AddressBodyForm;
  updateField: <K extends keyof AddressBodyForm>(key: K, value: AddressBodyForm[K]) => void;
};

export const defaultForm: AddressBodyForm = {
  fullName: "",
  address: "",
  city: "",
  pinCode: "",
  isDefault: false,
};

export const ProfileStore = create<AddressStoreType>((set) => ({
  open: false,
  setOpen: (value: boolean) =>
    set({
      open: value,
    }),

  isEditing: null,

  setIsEditing: (address) => {
    address
      ? set({
          form: {
            fullName: address.fullName,
            address: address.address,
            city: address.city,
            pinCode: address.pinCode,
            isDefault: address.isDefault,
          },
          isEditing: address,
        })
      : set({
          form: defaultForm,
          isEditing :null
        });
  },
  form: defaultForm,

  updateField: (key, value) => {
    set((state) => ({
      form: {
        ...state.form,
        [key]: value,
      },
    }));
  },
}));
