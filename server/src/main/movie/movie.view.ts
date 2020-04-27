import { Detail, SearchResult } from '@iinfinity/movie-crawler';
import { GET, Inject, PathVariable, POST, RequestBody, View } from '@rester/core';
import { MovieController } from './movie.controller';

@View('movie')
export class MovieView {

  @Inject() controller!: MovieController;

  @GET('{{keyword}}')
  async search(
    @PathVariable('keyword') keyword: string
  ) {
    return this.controller.search(keyword);
  }

  @GET('details/{{keyword}}')
  async searchDetails(
    @PathVariable('keyword') keyword: string
  ) {
    const results = await this.controller.search(keyword);
    const details: Detail[] = [];
    for (const result of results) {
      details.push(await this.controller.getDetail(result.url));
    }
    return details;
  }

  @POST('detail')
  async getDetail(
    @RequestBody() data: { source: string; }
  ) {
    return this.controller.getDetail(data.source);
  }

}
