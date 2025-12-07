import { Layout } from './ui/Layout.js';
import { Renderer } from './ui/Renderer.js';

const main = () => {
  const layout = new Layout();
  const renderer = new Renderer(layout);

  renderer.renderPlaceholder();
};

main();
