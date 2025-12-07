import { Layout } from './Layout.js';

export class Renderer {
  private layout: Layout;

  constructor(layout: Layout) {
    this.layout = layout;
  }

  public renderPlaceholder(): void {
    this.layout.mapBox.setContent('{center}Map Area Placeholder{/center}');
    this.layout.sidebarBox.setContent('Player: Hero\nHP: 10/10');
    this.layout.logBox.setContent('Welcome to Depths of the Terminal!');
    this.layout.render();
  }
}
