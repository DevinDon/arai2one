import { Movie } from '@iinfinity/movie-crawler';
import { GET, Inject, PathVariable, POST, RequestBody, View } from '@rester/core';
import { MovieController } from './movie.controller';

@View('movie')
export class MovieView {

  @Inject() controller!: MovieController;

  @GET('{{id}}')
  async getDetail(
    @PathVariable('id') id: string
  ) {
    return this.controller.getDetail(id);
  }

  @POST()
  async searchDetails(
    @RequestBody() ids: string[]
  ) {
    const details = await Promise.all(ids.map(id => this.controller.getDetail(id)));
    console.log('details: ', details);
    return details.filter(v => v);
  }

}
