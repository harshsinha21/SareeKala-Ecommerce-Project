import { Injectable } from '@angular/core';
import { Product } from './_model/product.model';
import { FileHandle } from './_model/file-handle.model';
import { DomSanitizer } from '@angular/platform-browser';


@Injectable({
  providedIn: 'root'
})
export class ImageProcessorService {

  constructor(private sanitizer: DomSanitizer) { }

  public createImages(product: Product) {

    if (typeof window === 'undefined') {
      console.warn('Skipping image processing: not running in browser.');
      return product;
    }

    const productImages: any[] = product.productImages;
    const productImagestoFileHandle: FileHandle[] = [];
    for(let i = 0; i < productImages.length; i++) {
      const imageData = productImages[i];
      const imageBlob = this.dataURItoBlob(imageData.bytes, imageData.type);
      const imageFile = new File([imageBlob], imageData.name, {type: imageData.type});
      const newFileHandle: FileHandle = {
        file: imageFile,
        url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
      };

      productImagestoFileHandle.push(newFileHandle);
    }
    product.productImages = productImagestoFileHandle;
    return product;
  }

  public dataURItoBlob(picBytes: string, imageType: string) {

    if (typeof window === 'undefined') {
      throw new Error('Cannot convert base64 to blob: window is not defined');
    }

    const byteString = window.atob(picBytes);
    const buffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(buffer);

    for(let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([int8Array], {type: imageType});
    return blob;

  }
}
