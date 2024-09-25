import { ProductListItem, productListStorage } from '../storages';
import { openSidePanel } from './actions';

export async function addProduct(product: ProductListItem) {
  console.log('initial products:', await productListStorage.get());
  const newProductAdded = await productListStorage.add(product);
  openSidePanel(product.id);
  console.log('final products:', await productListStorage.get());
  return newProductAdded;
}
