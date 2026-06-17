import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import type { Product } from "@/features/admin/products/type";

type ProductTableProps = {
  products: Product[];
  onEdit: (product: Product) => void;
};

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-700 border-green-200";
    case "draft":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "inactive":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const ProductTable = ({
  products,
  onEdit,
}: ProductTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-20">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-right w-24">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-40 text-center text-muted-foreground"
              >
                No products found
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow
                key={product._id}
                className="transition-colors hover:bg-slate-50"
              >
                <TableCell>
                  <div className="h-14 w-14 overflow-hidden rounded-lg border bg-slate-100">
                    <img
                      src={product.images?.[0]?.url}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </TableCell>

                <TableCell>
                  <div className="max-w-[250px]">
                    <p className="truncate font-medium text-slate-900">
                      {product.title}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      ID: {product._id.slice(-6)}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="font-medium">
                  {product.brand}
                </TableCell>

                <TableCell>
                  {product.category.name}
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusVariant(
                      product.status
                    )}
                  >
                    {product.status}
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  <span
                    className={`font-medium ${
                      product.stock <= 5
                        ? "text-red-600"
                        : "text-slate-700"
                    }`}
                  >
                    {product.stock}
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;