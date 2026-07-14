import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import type { ApplyPromo, ApplyPromoResponse, Cart, CartBody, CartItem, CreateCheckoutBody, CreateCheckoutResponse, DeleteCartBody, PointsResponse, syncCart, syncItem, verifyCheckoutBody, verifyCheckoutResponse } from "./types";

export function getCartApi() {
  return apiGet<Cart>("/customer/cart");
}

export function createCartApi(body: CartBody) {
  return apiPost<Cart, CartBody>("/customer/cart", body);
}

export function updateCartApi(body: CartBody) {
  return apiPut<Cart, CartBody>("/customer/cart/item", body);
}

export function deleteCartApi(body: DeleteCartBody) {
  const params = new URLSearchParams();

  params.append("id", body.id);

  if (body.color) params.append("color", body.color);
  if (body.size) params.append("size", body.size);

  return apiDelete<Cart>(`/customer/cart?${params.toString()}`);
}

export function syncCartApi(body : syncItem[]){
  return apiPost<Cart,syncCart>('/customer/cart/sync',{items : body})
}

export function createCheckoutSessionApi (body : CreateCheckoutBody){
  return apiPost<CreateCheckoutResponse,CreateCheckoutBody>('/customer/checkout/create-session',body)
}

export function verifyCheckoutApi (body : verifyCheckoutBody){
  return apiPost<verifyCheckoutResponse,verifyCheckoutBody>('/customer/checkout/verify', body)
}

export function applyPromoApi (body : ApplyPromo){
  return apiPost<ApplyPromoResponse, ApplyPromo>('/customer/promo/apply',body)
}

export function getPointsApi() {
  return apiGet<PointsResponse>("/customer/points");
}

export function payWithPointsApi (body : CreateCheckoutBody){
  return apiPost<CreateCheckoutResponse,CreateCheckoutBody>('/customer//checkout/pay-with-points',body)
}