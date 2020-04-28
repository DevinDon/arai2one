import { GET, Inject, PathVariable, View } from '@rester/core';
import { SearchController } from './search.controller';

@View('search')
export class SearchView {

  @Inject() controller!: SearchController;

  @GET('{{keyword}}')
  async search(
    @PathVariable('keyword') keyword: string
  ) {
    return this.controller.search(decodeURIComponent(keyword));
  }

}
