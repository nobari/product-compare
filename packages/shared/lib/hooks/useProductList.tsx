import '../../index.scss';
import { useStorageSuspense } from './useStorageSuspense';
import { ProductList, productListStorage } from '../storages';
import ProductCard from '../components/ProductCard';
import { useEffect, useMemo, useState } from 'react';

export const useProductList = () => {
  const productList: ProductList = useStorageSuspense(productListStorage);
  const [isOpen, setIsOpen] = useState(true);
  const ProductListComponent = useMemo(() => {
    const Component = () => (
      <div className="row">
        {productList.map(product => (
          <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    );
    Component.displayName = 'ProductListComponent';
    return Component;
  }, [productList]);
  useEffect(() => {
    window.addEventListener('open-product', (e: any) => {
      console.log('open-product', e.detail);
      setIsOpen(false);
      setTimeout(() => {
        setIsOpen(true);
      }, 500);
    });
  }, [setIsOpen]);

  const ProductListAccordion = useMemo(() => {
    const Component = () => (
      <div className="accordion tw-m-2" id="productListAccordion">
        <div className="accordion-item tw-border tw-rounded-b-lg">
          <h2 className="accordion-header" id="headingProductList">
            <button
              className={`accordion-button tw-text-sm tw-font-bold tw-h-8 ${isOpen ? '' : 'collapsed'}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseProductList"
              aria-expanded={isOpen}>
              {isOpen ? 'Hide' : 'Show'} Product List {productList?.length ? `(${productList.length})` : ''}
            </button>
          </h2>
          <div
            id="collapseProductList"
            className={`accordion-collapse ${isOpen ? 'show' : 'collapse'} tw-bg-primary tw-bg-opacity-75 tw-max-h-[50vh] tw-overflow-y-auto`}
            aria-labelledby="headingProductList"
            data-bs-parent="#productListAccordion">
            <div className="accordion-body">
              <ProductListComponent />
            </div>
          </div>
        </div>
      </div>
    );
    Component.displayName = 'ProductListAccordion';
    return Component;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ProductListComponent, isOpen]);
  return {
    productList,
    ProductListComponent,
    ProductListAccordion,
    clear: productListStorage.clear,
    isOpen,
    setIsOpen,
  };
};
