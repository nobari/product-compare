import './ChatBox.scss';
import { marked } from 'marked';
import hljs from 'highlight.js';
import React, { useEffect } from 'react';
import { replaceProductIds } from '../tools/parser';
import { ProductListItem, Result } from '../storages';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

interface ChatBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  result: Result;
  productList: ProductListItem[];
  remove: () => void;
}
function productIdToHtml(productId: string, productList: ProductListItem[]) {
  const product = productList.find(p => p.id === productId);
  if (!product) {
    return productId;
  }
  return `<a class="product-link" target="_blank" href="${product.url}"><img class="product-thumbnail" src="${product.thumbnail}" alt="${productId}"><span class="product-title">${product.title}</span></a>`;
}
async function getPreviewHtml(text: string, productList: ProductListItem[]) {
  const html = await marked.parse(text);
  const HtmlWithProducts = replaceProductIds(html, productId => productIdToHtml(productId, productList));
  // Create a temporary container to manipulate the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = HtmlWithProducts;

  // Find all <p> tags and set the dir attribute to "rtl"
  tempDiv.querySelectorAll('*').forEach(el => {
    if (/[\u0590-\u05FF\u0600-\u06FF]/.test(el.textContent || '')) {
      el.setAttribute('dir', 'rtl');
    }
  });
  // Check if all sibling elements have 'dir="rtl"' and set it on the parent if true
  tempDiv.querySelectorAll('*').forEach(element => {
    //if element is table add .table class
    if (element.tagName === 'TABLE') {
      element.classList.add('table', 'table-hover', 'table-bordered', 'table-striped', 'table-responsive');
    }
    if (element.childElementCount > 0) {
      const children = Array.from(element.children);
      const allChildrenRTL = children.every(child => child.getAttribute('dir') === 'rtl');
      if (allChildrenRTL) {
        element.setAttribute('dir', 'rtl');
        children.forEach(child => {
          child.removeAttribute('dir');
        });
      }
    }
  });

  // Return the modified HTML
  return tempDiv.innerHTML;
}

function highlightPreCode(htmlString: string): string {
  // Create a temporary container for the HTML content
  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = htmlString;

  // Find all <pre><code> blocks in the HTML
  const codeBlocks = tempContainer.querySelectorAll('pre code');

  // Highlight each code block
  codeBlocks.forEach(block => {
    hljs.highlightElement(block as HTMLElement);
  });

  return tempContainer.innerHTML;
}

const ChatBox: React.FC<ChatBoxProps> = ({ result, productList, remove, ...props }) => {
  const [parsed, setParsed] = React.useState<string | undefined>();
  const [typeClass, setTypeClass] = React.useState<string>();
  const [border, setBorder] = React.useState<string>();
  useEffect(() => {
    if (result.type === 'assistant') {
      setTypeClass('!tw-rounded !tw-rounded-l-none tw-mr-2');
      setBorder('!tw-border-gray-200');
    }
    if (result.type === 'user') {
      setTypeClass('!tw-rounded !tw-rounded-r-none tw-ml-2');
      setBorder('!tw-border-blue-200');
    }
    if (result.type === 'compare') {
      setTypeClass('!tw-rounded');
      setBorder('!tw-border-primary');
    }
  }, [result.type]);
  React.useEffect(() => {
    const processText = async () => {
      const trimmedText = result.data.trim();
      if (!trimmedText) {
        setParsed(undefined);
        return;
      }

      const parsedMarkdown = await getPreviewHtml(trimmedText, productList);
      const highlightedHtml = highlightPreCode(parsedMarkdown);
      setParsed(`<div>${highlightedHtml}</div>`);
    };

    processText();
  }, [result.data, productList]);
  return (
    parsed && (
      <div className="tw-p-4 tw-relative" {...props}>
        <button
          onClick={remove}
          className={`btn btn-sm tw-p-0 tw-w-8 tw-h-8 btn-light btn-circle tw-absolute tw-top-0 tw-right-0 ${border}`}>
          <FontAwesomeIcon icon={faClose} />
        </button>
        <div
          className={`chat-box-html tw-overflow-y-scroll tw-border tw-p-2 tw-bg-white tw-prose tw-max-w-full ${border} ${typeClass}`}
          dangerouslySetInnerHTML={{ __html: parsed }}
        />
      </div>
    )
  );
};

export default ChatBox;
