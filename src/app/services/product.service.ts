import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable, catchError, of, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000';
  
  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product);
  }

  getProductById(id: string) : Observable<Product>{
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  saveProduct(id:string, product : Product) :Observable<Product>{
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProducts(id : string) : Observable<boolean>{
    return this.http.delete<boolean>(`${this.apiUrl}/products/${id}`);
  }
}
