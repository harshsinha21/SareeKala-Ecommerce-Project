import { FileHandle } from "./file-handle.model";

export interface Product {
    productName: string,
    productDesc: string,
    productPrice: number,
    productDiscountedPrice: number,
    productImages: FileHandle[]
}