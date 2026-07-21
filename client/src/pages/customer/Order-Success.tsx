import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { Link } from "react-router-dom"

const OrderSuccess = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
            <Check
              className="h-10 w-10 text-green-600"
              strokeWidth={3}
            />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          Order Placed Successfully!
        </h1>

        {/* Description */}
        <p className="text-gray-500 mb-8">
          Your payment is complete and your order has been confirmed.
          Thank you for shopping with us.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <Button
            asChild
             variant='default'
            className="w-full sm:w-auto "
          >
            <Link to="/collections">
              Continue Shopping
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Link to="/">
              Go to Home
            </Link>
          </Button>

        </div>

      </div>
    </div>
  )
}

export default OrderSuccess