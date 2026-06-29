import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDeleteMutation } from "@/features/admin/promo/hooks"
import type { Promo } from "@/features/admin/promo/type"
import { Pencil, Trash2 } from "lucide-react"

type PromoTableProps = {
  promos: Promo[]
  openEditDialog: (promo: Promo) => void
}

const PromoTable = ({
  promos,
  openEditDialog,
}: PromoTableProps) => {
  const deleteMutation = useDeleteMutation()

  function handleDelete(id: string) {
    deleteMutation.mutate(id)
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>Min Order</TableHead>
            <TableHead>Valid From</TableHead>
            <TableHead>Valid Till</TableHead>
            <TableHead className="text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {promos.length > 0 ? (
            promos.map((promo) => (
              <TableRow
                key={promo._id}
                className="transition-colors hover:bg-muted/30"
              >
                <TableCell className="font-medium">
                  {promo.code}
                </TableCell>

                <TableCell>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    {promo.percentage}%
                  </span>
                </TableCell>

                <TableCell>{promo.count}</TableCell>

                <TableCell>
                  ₹{promo.minimumOrderValue}
                </TableCell>

                <TableCell>
                  {formatDate(promo.startAt)}
                </TableCell>

                <TableCell>
                  {formatDate(promo.endAt)}
                </TableCell>

                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => openEditDialog(promo)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(promo._id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-32 text-center text-muted-foreground"
              >
                No promo codes found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default PromoTable