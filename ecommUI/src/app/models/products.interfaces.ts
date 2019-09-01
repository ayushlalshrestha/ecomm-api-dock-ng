import { Variation, Product } from "./product.models";

export interface ProductListData {
  pk: number,
  title: string;
  description: string;
  sold_by: String;
  price: number;
  tags: string[];
  variation: Variation[];
}

/** Builds and returns list of ProductListData from Products. */
export function getProductData(products: any[]): ProductListData[] {
  var productDataList = [];
  products.forEach(product => {
    productDataList.push({
      pk: product.pk,
      title: product.title,
      description: product.description,
      sold_by: product.user.username,
      price: product.variations[0].price,
      tags: product.tags,
      variation: [new Variation()]
    });

  });
  return productDataList;
};