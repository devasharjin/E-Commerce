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
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Paid
          </Badge>
        )

      case "pending":
        return <Badge variant="secondary">Pending</Badge>

      case "failed":
        return <Badge variant="destructive">Failed</Badge>

      default:
        return <Badge>{status}</Badge>
    }
  }

  const orderBadge = (status: string) => {
    switch (status) {
      case "processing":
        return <Badge variant="outline">Processing</Badge>

      case "shipped":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            Shipped
          </Badge>
        )

      case "delivered":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Delivered
          </Badge>
        )

      case "returned":
        return <Badge variant="destructive">Returned</Badge>

      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-semibold">Orders</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[70vh]">
            <Table>
              <TableHeader className="sticky top-0 z-20 bg-background">
                <TableRow>
                  <TableHead className="w-[150px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Paid At</TableHead>
                  <TableHead className="text-center">
                    Update Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-20 text-center text-muted-foreground"
                    >
                      Loading orders...
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && (!orders?.orders || !orders.orders.length) && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-20 text-center text-muted-foreground"
                    >
                      No Orders Found
                    </TableCell>
                  </TableRow>
                )}

                {orders?.orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/40">
                    <TableCell className="font-semibold">
                      #{order.id.slice(-8).toUpperCase()}
                    </TableCell>

                    <TableCell className="font-medium">
                      {order.customerName}
                    </TableCell>

                    <TableCell className="text-center">
                      {order.totalItems}
                    </TableCell>

                    <TableCell className="font-semibold">
                      ₹{order.totalAmount}
                    </TableCell>

                    <TableCell>{paymentBadge(order.paymentStatus)}</TableCell>

                    <TableCell>{orderBadge(order.orderStatus)}</TableCell>

                    <TableCell>
                      {order.paidAt
                        ? new Date(order.paidAt).toLocaleDateString()
                        : "-"}
                    </TableCell>

                    <TableCell className="text-center">
                      {order.paymentStatus === "pending" ||
                        order.paymentStatus === "failed" ? (
                        <Badge variant="secondary">Payment Pending</Badge>
                      ) : order.orderStatus === "delivered" ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Delivered
                        </Badge>
                      ) : order.orderStatus === "returned" ? (
                        <Badge variant="destructive">Returned</Badge>
                      ) : (
                        <Select
                          
                                defaultValue={(order.orderStatus === 'shipped') ? 'shipped' : 'processing'} 
                          onValueChange={(value: OrderStatus) =>
                            updateOrder(order.id, value)
                          }
                          disabled={loadingId === order.id}
                        >
                          <SelectTrigger className="mx-auto w-[170px]">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="processing" disabled>
                              Processing
                            </SelectItem>
                            <SelectItem value="shipped" disabled= {order.orderStatus === 'shipped'}>
                              Shipped
                            </SelectItem>
                            <SelectItem value="delivered" disabled = {!(order.orderStatus==='shipped')}>
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