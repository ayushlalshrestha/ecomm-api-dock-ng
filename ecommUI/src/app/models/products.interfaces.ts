import { Variation, Product } from "./product.models";

export interface ProductListData {
  pk: number,
  title: string;
  description: string;
  sold_by: String;
  price: number;
  tags: string[];
  image: string;
  variations: Variation[];
}


/** Serializes & returns ProductListData from Product */
export function getProductData(product: any): ProductListData {
    var image = null;
    if (product.variations && product.variations[0] && product.variations[0].variationimages && product.variations[0].variationimages[0]){
        if (product.variations[0].variationimages[0].image) {
            image = product.variations[0].variationimages[0].image;
        }
    }
    return {
        pk: product.pk,
        title: product.title,
        description: product.description,
        sold_by: product.user.username,
        price: product.variations[0].price,
        tags: product.tags,
        image: image,
        variations: product.variations
    }
}


/** Builds and returns list of ProductListData from Products */
export function getProductsData(products: any[]): ProductListData[] {
  var productDataList = [];
  products.forEach(product => {
    productDataList.push(getProductData(product));
  });
  return productDataList;
};