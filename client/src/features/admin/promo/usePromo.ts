import { useState } from "react";
import { usePromosData } from "./hooks";
import type { Promo } from "./type";

const usePromo = () => {
  
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState<Promo | null>(null);
  const [search, setSearch] = useState("");
  const { data, isLoading } = usePromosData(search);
  const promos = data?.promos ?? []
  

  function openCreateDialog() {
    setPromoDialogOpen(true);
    setEditDialogOpen(null);
  }

  function openEditDialog(promo: Promo) {
    setPromoDialogOpen(true);
    setEditDialogOpen(promo);
  }

  function closePromoDialog() {
    setPromoDialogOpen(false);
    setEditDialogOpen(null);
  }

 function handlePromoDialogChange(open: boolean) {
  setPromoDialogOpen(open);

  if (!open) {
    setEditDialogOpen(null);
  }
}

  return {
    openCreateDialog,
    openEditDialog,
    editDialogOpen,
    promoDialogOpen,
    setPromoDialogOpen,
    handlePromoDialogChange,
    closePromoDialog,
    isLoading,
    search,
    setSearch,
    promos
  };
};
export default usePromo;
