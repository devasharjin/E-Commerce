
import { CategoryDialog } from "@/components/admin/products/category-Dialog";
import { ProductDialog } from "@/components/admin/products/product-dialog";
import ProductTable from "@/components/admin/products/products-table";
import { AdminProductToolbar } from "@/components/admin/products/products-toolbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminProducts } from "@/features/admin/products/use-admin-products";

const AdminProducts = () => {
  const {search,
         setSearch,
         products,
         setProducts,
         categories,
         setCategories,
         loading,
         setLoading,
         openCreateDialog,
         closeProductDialog,
         categoryDialogOpen,
         setCategoryDialogOpen,
         productDialogOpen,
         setProductDialogOpen,
         editingProducts,
         refreshAll,
         openEditDialog
        } = useAdminProducts()

  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Products
          </CardTitle>
        </CardHeader>

        <CardContent>
          <AdminProductToolbar
            search={search}
            onChangeSearch={setSearch}
            onAddProducts={openCreateDialog}
            onManageCategories={() => setCategoryDialogOpen(true)}
          />
        </CardContent>
        <ProductTable products={products} onEdit={openEditDialog}/>
      </Card>
      <CategoryDialog
          open={categoryDialogOpen}
          onOpenChange={setCategoryDialogOpen}
          categories={categories}
          onSaved={refreshAll}
         />
      <ProductDialog
        open = {productDialogOpen}
        onOpenChange={(open)=>{
          if(!open){
             (closeProductDialog())
             return
          }
         setProductDialogOpen(true)
        }}
        categories={categories}
        product={editingProducts}
        onSaved={refreshAll}
      />
    </div>
  );
};

export default AdminProducts;