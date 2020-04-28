import { CORSHandler, Rester } from '@rester/core';
import { MovieEntity } from './movie/movie.model';
import { MovieView } from './movie/movie.view';
import { SearchView } from './search/search.view';
import { SummaryEntity } from './summary/summary.model';

const rester = new Rester()
  .configDatabase
  .setEntities([MovieEntity, SummaryEntity])
  .end()
  .configViews
  .add(MovieView, SearchView)
  .end()
  .configHandlers
  .add(CORSHandler)
  .end()
  .listen();
