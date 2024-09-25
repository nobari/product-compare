import { ProductListItem } from '../storages';
import { productDetailIds } from '../storages/productListStorage';

export function getPureTextContent(el?: HTMLElement) {
  if (!el) {
    return '';
  }
  const elClone = el.cloneNode(true) as HTMLElement;
  const unwantedElements = elClone.querySelectorAll('script, style, i');
  unwantedElements.forEach(elem => elem.parentNode?.removeChild(elem));

  // Remove text nodes that contain only whitespace or line breaks
  elClone.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()) {
      node.parentNode?.removeChild(node);
    }
  });

  return elClone.textContent?.trim() || '';
}

const PRODUCT_DETAIL_IDs = {
  asin: 'asin',
  title: 'productTitle',
  price: 'priceValue',
  symbol: 'priceSymbol',
  thumbnail: 'productImageUrl',
  category: 'productCategory',
};
export function getProductListItem(doc: Document) {
  if (!doc) {
    window.alert('no document');
    return;
  }
  const dp = doc.getElementById('dp-container');
  if (!dp) {
    console.log('error no product');
    return;
  }
  const url = (doc.querySelector('link[rel="canonical"]') as HTMLLinkElement)?.href || window.location.href;

  const prices: string[] = [];
  document.querySelectorAll('.a-price>.a-offscreen').forEach(t => {
    const text = t?.textContent;
    if (text) {
      prices.push(text);
    }
  });
  //find cheapest price from strings like "£2.99"
  let cheapestPriceIndex = 0;
  for (let i = 1; i < prices.length; i++) {
    const existingMin = parseFloat(prices[cheapestPriceIndex].replace(/[^0-9.]/g, ''));
    const newMin = parseFloat(prices[i].replace(/[^0-9.]/g, ''));
    console.log(`${existingMin} < ${newMin} = ${existingMin < newMin}`);
    if (newMin < existingMin) {
      cheapestPriceIndex = i;
    }
  }
  const priceText = prices[cheapestPriceIndex];
  const image =
    (dp.querySelector('#main-image-container .selected img') as HTMLImageElement)?.src ||
    (dp.querySelector('#landingImage') as HTMLImageElement)?.src ||
    '';
  const details: Record<DetailKeys, string> = {} as typeof productDetailIds;
  type DetailKeys = keyof typeof productDetailIds;
  for (const [key, val] of Object.entries(productDetailIds)) {
    const el = dp.querySelector(`#${val}`) as HTMLInputElement;
    // console.log(`${key}:${val}: ${getPureTextContent(el)}`);
    details[key as DetailKeys] = trimText(getPureTextContent(el));
  }

  const product = {
    from: 'amazon',
    url,
    image,
    price: {
      text: priceText,
    },
    details,
  } as ProductListItem;
  const breadCrumbs = dp.querySelector('#wayfinding-breadcrumbs_feature_div') as HTMLElement;
  if (breadCrumbs && breadCrumbs.querySelectorAll('ul li').length > 2) {
    product.category = breadCrumbs.innerText;
  }
  const prodDetails = dp.querySelector('#prodDetails');
  if (prodDetails) {
    product.tables = Array.from(prodDetails.querySelectorAll('table'))
      .map(trimReview)
      .filter(e => e)
      .join('\n');

    product.price.val = Number.parseFloat(
      (prodDetails.querySelector(`#${PRODUCT_DETAIL_IDs.price}`) as HTMLInputElement)?.value,
    );
    product.price.symbol = (prodDetails.querySelector(`#${PRODUCT_DETAIL_IDs.symbol}`) as HTMLInputElement)?.value;
    product.thumbnail = (prodDetails.querySelector(`#${PRODUCT_DETAIL_IDs.thumbnail}`) as HTMLInputElement)?.value;

    product.title = (prodDetails.querySelector(`#${PRODUCT_DETAIL_IDs.title}`) as HTMLInputElement)?.value;
    product.id = (prodDetails.querySelector(`#${PRODUCT_DETAIL_IDs.asin}`) as HTMLInputElement)?.value;

    if (!product.category) {
      product.category = (prodDetails.querySelector(`#${PRODUCT_DETAIL_IDs.category}`) as HTMLInputElement)?.value;
    }
  } else {
    const detailBullet = dp.querySelector('#detailBulletsWithExceptions_feature_div') as HTMLElement;
    if (detailBullet) {
      product.tables = trimReview(detailBullet);
    }
    product.price.val = Number.parseFloat(
      (doc.getElementById('twister-plus-price-data-price') as HTMLInputElement)?.value ||
        (doc.querySelector('input[name="displayedPrice"]') as HTMLInputElement)?.value,
    );
    product.price.symbol =
      (doc.getElementById('twister-plus-price-data-price-unit') as HTMLInputElement)?.value ||
      (doc.querySelector('input[name="displayedPriceCurrencyCode"]') as HTMLInputElement)?.value;

    product.thumbnail = (dp.querySelector('#imageBlock ul li.imageThumbnail img') as HTMLImageElement)?.src || image;

    product.title = (dp.querySelector('#productTitle') as HTMLSpanElement)?.innerText;
    product.id = (dp.querySelector('#ASIN') as HTMLInputElement)?.value;
  }
  if (!product.details.reviews) {
    product.details.reviews = trimReview(dp.querySelector('#averageCustomerReviews') as HTMLElement);
  }
  console.log('product:', product);
  return product;
}
const PRODUCT_ID_SANDWICH = 'PXP';
export function productToString(product: ProductListItem) {
  let detail = '';
  for (const [key, val] of Object.entries(product.details)) {
    const trimmed = trimText(val);
    if (trimmed) {
      detail += `${key}:${trimmed}\n`;
    }
  }
  const beforeFinalTrim = `id:"${PRODUCT_ID_SANDWICH}${product.id}${PRODUCT_ID_SANDWICH}",
  title:"${product.title}",
  price:"${product.price.text}",
  category:"${product.category}",
  detail:"${detail}",
  tables:"${product.tables}",
  `;
  const finalTrim = beforeFinalTrim.replace(/"/g, '\\"');
  return finalTrim;
}
export function replaceProductIds(str: string, replaceWith: (productId: string) => string) {
  return str.replace(new RegExp(`${PRODUCT_ID_SANDWICH}(\\w+)${PRODUCT_ID_SANDWICH}`, 'g'), (match, p1) =>
    replaceWith(p1),
  );
}

function trimText(text: string) {
  return text.trim().replace(/\s{2,}/g, '  ');
}

function trimReview(e?: HTMLElement) {
  if (!e) {
    return '';
  }
  e.querySelector('i')?.remove();
  const trimmed = trimText(e.innerText);
  return trimmed;
}
