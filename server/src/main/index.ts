import { CORSHandler, Rester } from '@rester/core';
import { MovieView } from './movie/movie.view';

const rester = new Rester()
  .configViews
  .add(MovieView)
  .end()
  .configHandlers
  .add(CORSHandler)
  .end()
  .listen();
