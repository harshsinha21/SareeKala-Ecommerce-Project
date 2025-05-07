import { FileHandle } from "./file-handle.model";

export interface Product {
    productId: number | null,
    productName: string,
    productDesc: string,
    productPrice: number,
    productDiscountedPrice: number,
    quantity: number;
    productImages: FileHandle[]
}