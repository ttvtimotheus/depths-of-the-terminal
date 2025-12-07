import blessed from 'neo-blessed';

export type InputCommand = 
  | { type: 'move', dx: number, dy: number }
  | { type: 'wait' }
  | { type: 'quit' };

export class InputHandler {
  constructor(private screen: blessed.Widgets.Screen) {}

  public listen(callback: (cmd: InputCommand) => void): void {
    this.screen.key(['up', 'k', 'w'], () => callback({ type: 'move', dx: 0, dy: -1 }));
    this.screen.key(['down', 'j', 's'], () => callback({ type: 'move', dx: 0, dy: 1 }));
    this.screen.key(['left', 'h', 'a'], () => callback({ type: 'move', dx: -1, dy: 0 }));
    this.screen.key(['right', 'l', 'd'], () => callback({ type: 'move', dx: 1, dy: 0 }));
    this.screen.key(['.', 'space'], () => callback({ type: 'wait' }));
    this.screen.key(['escape', 'q'], () => callback({ type: 'quit' }));
  }
}
