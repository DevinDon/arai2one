import { CORSHandler, Rester } from '@rester/core';
import { MovieEntity } from './movie/movie.model';
import { MovieView } from './movie/movie.view';
import { SearchEntity } from './movie/search.model';

const rester = new Rester()
  .configDatabase
  .setEntities([MovieEntity, SearchEntity])
  .end()
  .configViews
  .add(MovieView)
  .end()
  .configHandlers
  .add(CORSHandler)
  .end()
  .listen();
