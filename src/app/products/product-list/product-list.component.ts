import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { DeleteProduct, GetProduct } from 'src/app/store/actions/products.action';
import { ProductState } from 'src/app/store/state/product.state';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {

  @Select(ProductState.getProductList) products$: Observable<Product[]> | undefined;
  @Select(ProductState.productLoaded) productsLoaded$!: Observable<boolean>;
  productsLoadedSubscription!: Subscription;

  constructor(private productService: ProductService, private router: Router, private store: Store) { }

  ngOnInit() {
    this.products$?.subscribe();
    this.loadProducts();
  }

  deleteProduct(id: string) {
    this.store.dispatch(new DeleteProduct(id));
    //this.productService.deleteProducts(id).subscribe();
    this.loadProducts();
  }

  loadProducts() {
    this.productsLoadedSubscription = this.productsLoaded$?.subscribe((isLoaded) => {
      if (!isLoaded) {
        this.store.dispatch(new GetProduct());
      }
    });
  }

  ngOnDestroy() {
    this.productsLoadedSubscription.unsubscribe();
  }

}
