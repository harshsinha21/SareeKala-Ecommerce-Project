import { Product } from "./product.model";

export interface OrderHistory {
    orderId: number;
    orderFullName: string;
    orderFullOrder: string;
    orderContactNumber: number;
    orderStatus: string;
    orderAmount: number;
    product: Product;
    user: any;
}