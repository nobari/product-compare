import { createRoot } from 'react-dom/client';
import App from '@src/app';
// eslint-disable-next-line
// @ts-ignore
import tailwindcssOutput from '@src/tailwind-output.css?inline';

// const root = document.createElement('div');
// root.id = 'gpt-shopper-content-view-root';
// root.style.position = 'fixed';
// root.style.bottom = '16px';
// root.style.right = '24px';
// root.style.zIndex = '9999';

const root = document.createElement('div');
root.id = 'gpt-shopper-content-view-root';

const shadowRoot = root.attachShadow({ mode: 'open' });

/** Inject styles into shadow dom */
const styleElement = document.createElement('style');
styleElement.innerHTML = tailwindcssOutput;
shadowRoot.appendChild(styleElement);
// root.appendChild(styleElement);
const rootDiv = document.createElement('div');
shadowRoot.appendChild(rootDiv);
rootDiv.id = 'root';
document.body.append(root);

createRoot(rootDiv).render(<App />);
