import { Crawler, Detail, SearchResult } from "@iinfinity/movie-crawler";
import { GET, Inject, PathVariable, POST, View, RequestBody } from "@rester/core";

@View('movie')
export class MovieView {

  @Inject() crawler!: Crawler;

  @GET('{{keyword}}')
  async search(
    @PathVariable('keyword') keyword: string
  ) {
    console.log(keyword);
    const result = await this.crawler.search(keyword)
      .then(v => {
        console.log(v);
        return v;
      })
      .catch(e => {
        console.error(e);
        throw e;
      });
    console.log(result);
    return result;
  }

  @POST()
  async getDetail(
    @RequestBody() data: SearchResult
  ) {
    const result = await this.crawler.getDetail(data.url);
    console.log(result);
    return result;
  }

}
