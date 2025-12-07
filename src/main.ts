import { Layout } from './ui/Layout.js';
import { Renderer } from './ui/Renderer.js';
import { Game } from './game/Game.js';
import { InputHandler } from './input/InputHandler.js';

const main = () => {
  const layout = new Layout();
  const game = new Game();
  const renderer = new Renderer(layout, game);
  const inputHandler = new InputHandler(layout.screen);
  
  // Start the game immediately for MVP
  game.startNewGame();
  renderer.render();
  
  inputHandler.listen((cmd) => {
    if (cmd.type === 'quit') {
      process.exit(0);
    }
    
    game.handleInput(cmd);
    renderer.render();
  });
};

main();
