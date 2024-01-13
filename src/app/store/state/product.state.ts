import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Product } from "src/app/models/product.model";
import { AddProduct, DeleteProduct, GetProduct, SetSelectedProduct, UpdateProduct } from "../actions/products.action";
import { ProductService } from "src/app/services/product.service";
import {  of, tap } from "rxjs";

//State Model
export class ProductStateModel {
    products!: Product[];
    isProductsLoaded!: boolean;
    selectedProduct!: Product;
}

//State
@State<ProductStateModel>({
    name: 'products',
    defaults: {
        products: [],
        isProductsLoaded: false,
        selectedProduct: { id: '', name: '', category: '', price: 0 }
    }
})

@Injectable()
export class ProductState {

    constructor(private productService: ProductService) { }

    //Selector for getProducts
    @Selector()
    static getProductList(state: ProductStateModel) {
        return state.products;
    }

    //Get Product By Id
    @Selector()
    static getProductById(state: ProductStateModel) {
        return state.selectedProduct;
    }

    //Selector for isProductLoaded
    @Selector()
    static productLoaded(state: ProductStateModel) {
        return state.isProductsLoaded;
    }

    @Action(SetSelectedProduct)
    setSelectedProduct({ getState, setState }: StateContext<ProductStateModel>, { id }: SetSelectedProduct) {
        const state = getState();
        const productList = state.products;
        const index = productList.findIndex(x => x.id === id);

        if(productList.length > 0){
            setState({
                ...state,
                selectedProduct: productList[index]
            })
            return of(null); 
        }else{
           return this.productService.getProductById(id).pipe(tap((data : Product)=>{
                
            const newproductList = [data];

                setState({
                    ...state,
                    products :newproductList,
                    selectedProduct: newproductList[0]
                })
            }));
        }   
    }

    //Action for getProducts
    @Action(GetProduct)
    getProducts({ getState, setState }: StateContext<ProductStateModel>) {
        return this.productService.getProducts().pipe(
            tap(res => {
                const state = getState();
                setState({
                    ...state, products: res,
                    isProductsLoaded: true
                })
            }
            ));
    }

    @Action(AddProduct)
    addProduct({getState, patchState} : StateContext<ProductStateModel>, {payload} : AddProduct){
        this.productService.addProduct(payload).subscribe((res : Product)=>{
            const state = getState();
            patchState({
                products :[...state.products,res]
            });
        });
    }

    @Action(DeleteProduct)
    DeleteProduct({getState, setState} : StateContext<ProductStateModel>, {id} : DeleteProduct){
        this.productService.deleteProducts(id).subscribe((res)=>{
            const state = getState();
            const productList = state.products.filter(product => product.id !== id);
            setState({
                ...state, products: productList
            })
        });
    }

    @Action(UpdateProduct)
    updateProduct({getState, patchState} : StateContext<ProductStateModel>, {payload} : UpdateProduct){
       this.productService.saveProduct(payload.id, payload).subscribe((res)=>{
        const state = getState();
        const allProducts = state.products;
        const index = allProducts.findIndex(x => x.id === payload.id);
        allProducts[index]= payload;

        patchState({
            products : allProducts
        })

       });
    }
}