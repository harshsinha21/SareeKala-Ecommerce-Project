import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileHandle } from '../_model/file-handle.model';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-show-product-images',
  imports: [MatGridListModule, CommonModule],
  templateUrl: './show-product-images.component.html',
  styleUrl: './show-product-images.component.css'
})
export class ShowProductImagesComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.recieveImages();
  }

  recieveImages() {
    console.log(this.data);
  }

}
