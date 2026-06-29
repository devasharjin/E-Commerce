import PromoDialog from "@/components/admin/promo/promo-dialog"
import PromoTable from "@/components/admin/promo/promo-table"
import PromoToolbar from "@/components/admin/promo/promo-toolbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import usePromo from "@/features/admin/promo/usePromo"

const AdminPromos = () => {
  const {
    openCreateDialog,
    openEditDialog,
    promoDialogOpen,
    handlePromoDialogChange,
    editDialogOpen,
    closePromoDialog,
    search,
    promos,
    setSearch
  } = usePromo()


  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <CardHeader className="space-y-4">
          <CardTitle className="text-2xl font-semibold">
            Coupons
          </CardTitle>

          <PromoToolbar
            openCreateDialog={openCreateDialog}
            search={search}
            setSearch={setSearch}
          />
        </CardHeader>

        <CardContent>
          <PromoTable 
           promos= {promos}
            openEditDialog={openEditDialog}
          />
        </CardContent>
      </Card>

      <PromoDialog
        open={promoDialogOpen}
        onOpenChange={handlePromoDialogChange}
        promo={editDialogOpen}
        closePromoDialog={closePromoDialog}
      />
    </div>
  )
}

export default AdminPromos