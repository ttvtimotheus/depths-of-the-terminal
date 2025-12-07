import blessed from 'neo-blessed';

export class Layout {
  public screen: blessed.Widgets.Screen;
  public mapBox: blessed.Widgets.BoxElement;
  public sidebarBox: blessed.Widgets.BoxElement;
  public logBox: blessed.Widgets.BoxElement;

  constructor() {
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'Depths of the Terminal'
    });

    // Map area: Top-Left, takes most space
    this.mapBox = blessed.box({
      top: 0,
      left: 0,
      width: '75%',
      height: '80%',
      label: ' Dungeon ',
      border: { type: 'line' },
      style: { border: { fg: 'white' } },
      tags: true
    });

    // Sidebar: Top-Right
    this.sidebarBox = blessed.box({
      top: 0,
      left: '75%',
      width: '25%',
      height: '80%',
      label: ' Stats ',
      border: { type: 'line' },
      style: { border: { fg: 'yellow' } },
      tags: true
    });

    // Log: Bottom
    this.logBox = blessed.box({
      top: '80%',
      left: 0,
      width: '100%',
      height: '20%',
      label: ' Log ',
      border: { type: 'line' },
      style: { border: { fg: 'green' } },
      scrollable: true,
      alwaysScroll: true,
      tags: true
    });

    this.screen.append(this.mapBox);
    this.screen.append(this.sidebarBox);
    this.screen.append(this.logBox);

    // Inventory List (hidden by default)
    this.inventoryList = blessed.list({
      parent: this.screen,
      top: 'center',
      left: 'center',
      width: '50%',
      height: '50%',
      label: ' Inventory ',
      border: { type: 'line' },
      style: {
        border: { fg: 'cyan' },
        selected: { bg: 'blue', fg: 'white' }
      },
      keys: true,
      vi: true,
      hidden: true,
      tags: true
    });
  }

  public inventoryList: blessed.Widgets.ListElement;

  public render(): void {
    this.screen.render();
  }
}
