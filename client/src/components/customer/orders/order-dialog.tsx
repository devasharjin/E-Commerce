import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAllOrder, useOrderReturn } from "@/features/customer/Orders/api"
import { useOrderStore } from "@/features/customer/Orders/store"
import type { singleOrder } from "@/features/customer/Orders/types"

const CustomerOrderDialog = () => {
  const { isOpen, setOpen } = useOrderStore()
  const { data: orders, isLoading } = useAllOrder()
  const { mutate: returnOrder, isPending } = useOrderReturn()

  const canReturnOrder = (order: singleOrder) => {
    if (order.orderStatus !== "delivered" || !order.deliveredAt) {
      return false
    }

    const deliveredDate = new Date(order.deliveredAt)
    const currentDate = new Date()
    const diffDays =
      (currentDate.getTime() - deliveredDate.getTime()) /
      (1000 * 60 * 60 * 24)

    return diffDays <= 7
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="max-w-6xl h-auto min-w-fit flex flex-col p-0 overflow-hidden rounded-xl">
        <DialogHeader className="px-6 py-5 border-b">
          <DialogTitle className="text-2xl font-semibold">
            My Orders
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1  overflow-hidden px-6 py-5">
          <div className="h-full overflow-auto rounded-lg border">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background">
                <TableRow>
                  <TableHead className="font-semibold">Order ID</TableHead>
                  <TableHead className="font-semibold">Items</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Payment</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Paid At</TableHead>
                  <TableHead className="text-center font-semibold">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16">
                      Loading orders...
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && (!orders?.orders || !orders.orders.length) && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16">
                      No orders found
                    </TableCell>
                  </TableRow>
                )}

                {orders?.orders.map((order) => (
                  <TableRow
                    key={order._id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <TableCell className="font-medium">
                      #{order._id.slice(-8).toUpperCase()}
                    </TableCell>

                    <TableCell>{order.totalItems}</TableCell>

                    <TableCell className="font-medium">
                      ₹{order.totalAmount}
                    </TableCell>

                    <TableCell className="capitalize">
                      {order.paymentStatus}
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
                        {order.orderStatus}
                      </span>
                    </TableCell>

                    <TableCell>
                      {order.paidAt
                        ? new Date(order.paidAt).toLocaleDateString()
                        : "-"}
                    </TableCell>

                    <TableCell className="text-center">
                      {order.orderStatus === "returned" ? (
                        <Button variant="outline" disabled>
                          Returned
                        </Button>
                      ) : canReturnOrder(order) ? (
                        <Button
                          onClick={() => returnOrder(order._id)}
                          disabled={isPending}
                        >
                          {isPending ? "Returning..." : "Return"}
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CustomerOrderDialog