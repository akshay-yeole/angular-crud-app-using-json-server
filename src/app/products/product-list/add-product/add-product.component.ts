import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { AddProduct } from 'src/app/store/actions/products.action';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {

  product: Product = { id: '', name: '', category: '', price: 0 };

  constructor(private productService: ProductService, private router : Router, private store : Store) {
  }

  addProduct() {
    this.product.id = this.generateGuid();
    this.store.dispatch(new AddProduct(this.product));
    this.router.navigateByUrl('/products');
  }
  cancel(){
    this.router.navigateByUrl('/products');
  }

  generateGuid() : string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

}
