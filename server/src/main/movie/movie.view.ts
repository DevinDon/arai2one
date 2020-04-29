import { GET, Inject, PathVariable, POST, RequestBody, View, PathQuery } from '@rester/core';
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
  async getDetails(
    @RequestBody() ids: string[]
  ) {
    const details = await Promise.all(ids.map(id => this.controller.getDetail(id)));
    return details.filter(v => v);
  }

  @GET('suggest')
  @GET('suggest/{{tag}}')
  async suggest(
    @PathVariable('tag') tag: Tag,
    @PathQuery('start') start: string = '0',
    @PathQuery('limit') limit: string = '10'
  ) {
    return this.controller.getSuggest(decodeURIComponent(tag) as any, +start, +limit);
  }

}
