import { Movie } from '@iinfinity/movie-crawler';
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
    const details: Movie[] = [];
    for (const result of results) {
      const detail = await this.controller.getDetail(result.id);
      if (detail) { details.push(detail); }
    }
    return details;
  }

  @POST('detail')
  async getDetail(
    @RequestBody() data: Pick<Movie, 'id'>
  ) {
    return this.controller.getDetail(data.id);
  }

}
