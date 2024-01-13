import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { SetSelectedProduct, UpdateProduct } from 'src/app/store/actions/products.action';
import { ProductState } from 'src/app/store/state/product.state';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit, OnDestroy {

  product: Product = { id: '', name: '', category: '', price: 0 };
  productId: string | undefined;
  productDataSubscription!: Subscription;
  @Select(ProductState.getProductById) productData$!: Observable<Product>;

  constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router, private store: Store) {
  }

  ngOnInit() {

    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          this.store.dispatch(new SetSelectedProduct(id));
          this.productDataSubscription = this.productData$.subscribe((data) => {
            this.product = data;
          });
        }
      }
    });
  }

  saveProduct() {
    //if (this.product !== undefined)
      //this.productService.saveProduct(this.product.id, this.product).subscribe(data => this.router.navigate(['products']));
      this.store.dispatch(new UpdateProduct(this.product));
      this.router.navigate(['products']);
    }

  cancel(){
    this.router.navigateByUrl('/products');
  }

  ngOnDestroy(): void {
    this.productDataSubscription.unsubscribe();
  }
}
