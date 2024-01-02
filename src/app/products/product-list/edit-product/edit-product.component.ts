import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  product?: Product = { id: '', name: '', category: '', price: 0 };
  productId:string | undefined;

  constructor(private productService: ProductService, private route: ActivatedRoute, private router : Router) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe({
      next : (params) => {
        const id = params.get('id');
        if(id){
          this.productService.getProductById(id).subscribe(data => this.product= data);
        }
      }
    });
  }

  saveProduct(){
    if(this.product !== undefined)
      this.productService.saveProduct(this.product.id, this.product).subscribe(data => this.router.navigate(['products']));
  }
}
