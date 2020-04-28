import { DoubanCrawler, Summary } from '@iinfinity/movie-crawler';
import { Controller, Inject } from '@rester/core';
import { MovieController } from '../movie/movie.controller';
import { SummaryEntity } from '../summary/summary.model';

@Controller()
export class SearchController {

  @Inject() private douban!: DoubanCrawler;
  @Inject() private movieController!: MovieController;

  async search(keyword: string): Promise<Summary[]> {
    // console.log(keyword, encodeURIComponent(keyword));
    const summaryFromDB = await SummaryEntity
      .find({
        where: {
          title: { $regex: new RegExp(`.*${keyword}.*`) }
        }
      });
    // 数据库中有记录则返回
    if (summaryFromDB && summaryFromDB.length) {
      // console.log('Summary in DB: ', summaryFromDB);
      return summaryFromDB;
    }
    // console.log('Not in DB');
    // 没有，尝试爬取豆瓣的搜索信息，目前只需要电影信息
    const summaryFromDouban = (await this.douban.search(keyword)).filter(v => v.type === 'movie');
    // console.log(summaryFromDouban);
    // 整理数据，异步后台
    summaryFromDouban.map<Promise<Summary | undefined>>(async v => {
      // 尝试从数据库中获取电影信息，或者爬取
      const movieFromDB = await this.movieController.getDetail(v.id);
      // 存在电影信息，合并
      const summary = movieFromDB && {
        id: v.id,
        title: v.title,
        image: v.img,
        type: v.type,
        year: +v.year,
        rating: movieFromDB.rating.star,
        hot: movieFromDB.rating.total,
        keywords: movieFromDB.types,
        description: movieFromDB.description
      } || undefined;
      // 写入数据库 Summary
      if (summary) { await SummaryEntity.insert(summary); }
      return summary;
    });
    // 只返回从豆瓣爬取的信息
    return summaryFromDouban.map<Summary>(v => ({
      id: v.id,
      title: v.title,
      image: v.img,
      type: v.type,
      year: +v.year,
      rating: 0,
      hot: 0,
      keywords: [],
      description: ''
    }));
  }

}
