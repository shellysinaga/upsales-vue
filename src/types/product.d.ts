import type Category from "./category";

declare interface Product {
    id?: number;
    name: string,
    sku: string,
    quantity: number | null,
    price: number | null,
    category_id: number | null,
    category?: Category | null,
  }
  
  export default Product
  