import { GET, Inject, PathVariable, POST, RequestBody, View } from '@rester/core';
import { MovieController } from './movie.controller';
import { Tag } from '@iinfinity/movie-crawler';

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
    return details.filter(v => v);
  }

  @GET('suggest')
  @GET('suggest/{{tag}}')
  async suggest(
    @PathVariable('tag') tag: Tag
  ) {
    return this.controller.getSuggest(tag);
  }

}
