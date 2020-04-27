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

  @GET('detail/{{keyword}}')
  async searchDetail(
    @PathVariable('keyword') keyword: string
  ) {
    console.log(keyword);
    const searchResults = await this.crawler.search(keyword);
    const details: Detail[] = [];
    for (const result of searchResults) {
      console.log('正在加载:' + result.title);
      details.push(await this.crawler.getDetail(result.url));
    }
    console.log(details);
    return details;
  }

  @POST('detail')
  async getDetail(
    @RequestBody() data: SearchResult
  ) {
    const result = await this.crawler.getDetail(data.url);
    console.log(result);
    return result;
  }

}
