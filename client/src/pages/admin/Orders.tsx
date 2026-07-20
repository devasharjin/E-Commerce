import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
  useGetAdminOrders,
  useUpdateAdminOrdrs,
} from "@/features/admin/orders/api"

import type { OrderStatus } from "@/features/customer/Orders/types"

const AdminOrders = () => {
  const { data: orders, isLoading } = useGetAdminOrders()
  const { mutate } = useUpdateAdminOrdrs()

  const [loadingId, setLoadingId] = useState<string | null>(null)

  const updateOrder = (orderId: string, status: OrderStatus) => {
    setLoadingId(orderId)

    mutate(
      {
        orderId,
        orderStatus: status,
      },
      {
        onSettled: () => setLoadingId(null),
      }
    )
  }

  const paymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-100">
            Paid
          </Badge>
        )

      case "pending":
        return (
          <Badge
            variant="secondary"
            className="rounded-md px-3 py-1 text-xs font-medium"
          >
            Pending
          </Badge>
        )

      case "failed":
        return (
          <Badge
            variant="destructive"
            className="rounded-md px-3 py-1 text-xs font-medium"
          >
            Failed
          </Badge>
        )

      default:
        return (
          <Badge className="rounded-md px-3 py-1 text-xs font-medium">
            {status}
          </Badge>
        )
    }
  }

  const orderBadge = (status: string) => {
    switch (status) {
      case "processing":
        return (
          <Badge
            variant="outline"
            className="rounded-md px-3 py-1 text-xs font-medium"
          >
            Processing
          </Badge>
        )

      case "shipped":
        return (
          <Badge className="rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100">
            Shipped
          </Badge>
        )

      case "delivered":
        return (
          <Badge className="rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-100">
            Delivered
          </Badge>
        )

      case "returned":
        return (
          <Badge
            variant="destructive"
            className="rounded-md px-3 py-1 text-xs font-medium"
          >
            Returned
          </Badge>
        )

      default:
        return (
          <Badge className="rounded-md px-3 py-1 text-xs font-medium">
            {status}
          </Badge>
        )
    }
  }

  return (
    <div className="p-6">
      <Card className="overflow-hidden rounded-xl border bg-background shadow-sm">
        <CardHeader className="border-b px-7 py-5">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Orders
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0" >
          <ScrollArea className="w-auto ">
            <Table>
              <TableHeader className="sticky top-0 z-20 bg-background">
                <TableRow className="border-b">
                  <TableHead className="h-14 px-7 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Order ID
                  </TableHead>

                  <TableHead className="h-14 px-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Customer
                  </TableHead>

                  <TableHead className="h-14 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Items
                  </TableHead>

                  <TableHead className="h-14 px-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Amount
                  </TableHead>

                  <TableHead className="h-14 px-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Payment
                  </TableHead>

                  <TableHead className="h-14 px-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Order
                  </TableHead>

                  <TableHead className="h-14 px-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Paid At
                  </TableHead>

                  <TableHead className="h-14 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Update Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-24 text-center text-sm text-muted-foreground"
                    >
                      Loading orders...
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && (!orders?.orders || !orders.orders.length) && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-24 text-center text-sm text-muted-foreground"
                    >
                      No Orders Found
                    </TableCell>
                  </TableRow>
                )}

                {orders?.orders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="h-16 transition-colors hover:bg-muted/40"
                  >
                    <TableCell className="px-7 text-sm font-semibold">
                      #{order.id.slice(-8).toUpperCase()}
                    </TableCell>

                    <TableCell className="px-5">
                      <p className="text-sm font-medium">
                        {order.customerName}
                      </p>
                    </TableCell>

                    <TableCell className="text-center text-sm font-medium">
                      {order.totalItems}
                    </TableCell>

                    <TableCell className="px-5 text-sm font-semibold">
                      ₹{order.totalAmount}
                    </TableCell>

                    <TableCell className="px-5">
                      {paymentBadge(order.paymentStatus)}
                    </TableCell>

                    <TableCell className="px-5">
                      {orderBadge(order.orderStatus)}
                    </TableCell>

                    <TableCell className="px-5 text-sm text-muted-foreground">
                      {order.paidAt
                        ? new Date(order.paidAt).toLocaleDateString()
                        : "-"}
                    </TableCell>

                    <TableCell className="text-center">
                      {order.paymentStatus === "pending" ||
                        order.paymentStatus === "failed" ? (
                        <Badge
                          variant="secondary"
                          className="rounded-md px-3 py-1 text-xs font-medium"
                        >
                          Payment Pending
                        </Badge>
                      ) : order.orderStatus === "delivered" ? (
                        <Badge className="rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-100">
                          Delivered
                        </Badge>
                      ) : order.orderStatus === "returned" ? (
                        <Badge
                          variant="destructive"
                          className="rounded-md px-3 py-1 text-xs font-medium"
                        >
                          Returned
                        </Badge>
                      ) : (
                        <Select
                          defaultValue={
                            order.orderStatus === "shipped"
                              ? "shipped"
                              : "processing"
                          }
                          onValueChange={(value: OrderStatus) =>
                            updateOrder(order.id, value)
                          }
                          disabled={loadingId === order.id}
                        >
                          <SelectTrigger className="mx-auto h-10 w-[170px] rounded-lg">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="processing" disabled>
                              Processing
                            </SelectItem>

                            <SelectItem
                              value="shipped"
                              disabled={order.orderStatus === "shipped"}
                            >
                              Shipped
                            </SelectItem>

                            <SelectItem
                              value="delivered"
                              disabled={order.orderStatus !== "shipped"}
                            >
                              Delivered
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminOrders