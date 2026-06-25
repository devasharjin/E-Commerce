import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id : process.env.RAZORPAY_KEY!,
    key_secret : process.env.RAZORPAY_SECRET!
})

export default razorpay

export function toSubUnits(amount : number){
    return Math.round(amount * 100)
}