import React from 'react';
import { ProductListItem, productListStorage } from '../storages';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
// import { productToString } from '../lib/tools/parser';

type ProductCardProps = {
  product: ProductListItem;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleRemove = async () => {
    await productListStorage.remove(product);
  };
  // const handleAlertProduct = () => {
  //   const str = productToString(product);
  //   console.log('product', str, product);
  //   alert(str);
  // };
  return (
    <div className="tw-bg-white tw-border tw-border-gray-200 tw-shadow-md tw-rounded-lg tw-m-2 tw-flex tw-flex-row tw-relative">
      <button className="btn btn-sm btn-light btn-circle tw-absolute -tw-top-2 -tw-right-2" onClick={handleRemove}>
        <FontAwesomeIcon icon={faClose} />
      </button>
      <div className="tw-w-24 tw-h-32 tw-mx-2 tw-my-auto">
        <img src={product.image} alt={product.title} className="tw-w-full tw-h-full tw-object-contain" />
      </div>
      <div className="tw-p-2 tw-pt-4 tw-flex-1">
        <p className="tw-font-medium tw-line-clamp-2 tw-m-0">{product.title}</p>
        <p className="tw-text-orange-800 tw-text-[20px] tw-font-roboto tw-my-1">{product.price.text}</p>
        {/* <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 bg-amber-300">
          Add to cart
        </a> */}
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="tw-bg-amber-300 tw-hover:tw-bg-amber-400 tw-w-[120px] tw-h-8 tw-px-4 tw-py-1.5 tw-rounded-[100px] tw-justify-center tw-items-center tw-gap-2.5 tw-inline-flex tw-no-underline">
          <div className="tw-text-center tw-text-black tw-text-sm tw-font-medium tw-font-roboto tw-leading-tight tw-tracking-tigh">
            Open
          </div>
        </a>
        {/* <div className="tw-flex tw-gap-2 tw-mt-4 tw-justify-center">
          <button
            className="tw-bg-blue-500 tw-hover:tw-bg-blue-700 tw-text-white tw-py-2 tw-px-4 tw-rounded tw-cursor-pointer"
            onClick={handleAlertProduct}>
            Show Details
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ProductCard;
