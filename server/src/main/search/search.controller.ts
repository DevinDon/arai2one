import { DoubanCrawler, Summary } from '@iinfinity/movie-crawler';
import { Controller, Inject } from '@rester/core';
import { MovieController } from '../movie/movie.controller';
import { SummaryEntity } from '../summary/summary.model';
import { logger } from '@iinfinity/logger';

@Controller()
export class SearchController {

  @Inject() private douban!: DoubanCrawler;
  @Inject() private movieController!: MovieController;

  async search(keyword: string): Promise<Summary[]> {
    const summaryFromDB = await SummaryEntity
      .find({
        where: {
          title: { $regex: keyword }
        }
      });
    // 数据库中有记录则返回
    if (summaryFromDB && summaryFromDB.length) {
      logger.info(`${keyword}: Hit cache from summary`);
      return summaryFromDB;
    }
    logger.info(`${keyword}: Crawler working for search`);
    // 没有，尝试爬取豆瓣的搜索信息，目前只需要电影信息，顺带处理下格式
    const summaryFromDouban = (await this.douban.search(keyword))
      .filter(v => v.type === 'movie')
      .map<Summary>(v => ({
        id: v.id,
        title: v.title,
        image: v.img,
        type: v.type,
        year: +v.year,
        rating: 0,
        hot: 0,
        keywords: [],
        description: v.url
      }));
    // 整理数据，异步后台
    summaryFromDouban.map<Promise<Summary | undefined>>(async v => {
      logger.info(`${keyword}: Get each movie.`);
      // 尝试从数据库中获取电影信息，或者爬取
      const movieFromDB = await this.movieController.getDetail(v.id).catch(e => logger.error(`${keyword}: `, e));
      // 存在电影信息，合并
      const summary = movieFromDB && {
        id: v.id,
        title: v.title,
        image: v.image,
        type: v.type,
        year: v.year,
        rating: movieFromDB.rating.star,
        hot: movieFromDB.rating.total,
        keywords: movieFromDB.types,
        description: movieFromDB.description
      } || undefined;
      // 写入 / 更新数据库 Summary
      if (summary) {
        SummaryEntity.update({ id: summary.id }, summary)
          .then(v => {
            if (v.affected) {
              logger.info(`${keyword}: Update summary with movie`);
            } else {
              SummaryEntity.insert(summary)
                .then(v => logger.info(`${keyword}: Insert summary with movie`));
            }
          });
      }
      return summary;
    });
    // 只返回从豆瓣爬取的信息
    return summaryFromDouban;
  }

  async searchOnly(keyword: string) {
    const summaryFromDB = await SummaryEntity
      .find({
        where: {
          title: { $regex: keyword }
        }
      });
    return summaryFromDB;
  }

}
