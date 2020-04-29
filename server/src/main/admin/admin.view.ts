import { delay } from '@iinfinity/delay';
import { logger } from '@iinfinity/logger';
import { DoubanCrawler, Summary } from '@iinfinity/movie-crawler';
import { GET, Inject, PUT, View } from '@rester/core';
import { getMongoRepository } from 'typeorm';
import { MovieController } from '../movie/movie.controller';
import { MovieEntity } from '../movie/movie.model';
import { SummaryEntity } from '../summary/summary.model';

@View('admin')
export class AdminView {

  @Inject() private douban!: DoubanCrawler;
  @Inject() private movie!: MovieController;

  private fetchTotal: number = 0;
  private indexTotal: number = 0;

  @GET('fetch')
  async getFetchState() {
    return { state: `in processing at ${this.fetchTotal}` };
  }

  @PUT('fetch')
  async fetch() {

    if (this.fetchTotal !== 0) {
      return { state: `in processing at ${this.fetchTotal}` };
    }

    (async () => {
      const tags = ['热门', '最新', '经典', '可播放', '豆瓣高分', '冷门佳片', '华语', '欧美', '韩国', '日本', '动作', '喜剧', '爱情', '科幻', '悬疑', '恐怖', '文艺'];
      const step = 20;

      for (const tag of tags) {
        for (let i = 0; i < 3 * 100; i += step) {
          logger.info(`Admin.fetch: 类别：${tag}，从 ${i} 到 ${i + step}`);
          const results = await this.douban.suggest(tag as any, i, step)
            .then(v => (logger.info(`Admin.fetch: 列表获取成功，总计 ${v.length} 项`), v))
            .catch(e => (logger.error(`Admin.fetch: 列表抓取失败，${tag} 类别从第 ${i} 项到第 ${i + step} 项`), []));
          // 没有更多推荐
          if (results.length === 0) { break; }
          // 循环爬取列表详情
          for await (const result of results) {
            logger.info(`Admin.fetch: 正在爬取 ${tag} 类别，总计第 ${++this.fetchTotal} 项`);
            if (await MovieEntity.findOne({ id: result.id })) {
              logger.info(`Admin.fetch: 数据库中已有数据，跳过 ${result.title}`);
              continue;
            }
            await this.movie.getDetail(result.id)
              .then(v => logger.info(`Admin.fetch: ${v?.title} 爬取完成，已写入数据库`))
              .catch(e => logger.error(`Admin.fetch: ${result.id} ${result.title} 爬取失败，原因：${e.message}`));
            await delay(15000 + Math.random() * 15000);
          }
          // 每次列表间隔 30 秒
          await delay(30 * 1000);
        }
        // 类别间隔 30 秒
        await delay(30 * 1000);
      }
    })();

    return { state: `starting update at ${new Date().toLocaleString()}` };

  }

  @GET('index')
  async getIndexState() {
    return { state: `in processing at ${this.indexTotal}` };
  }

  @PUT('index')
  async index() {

    if (this.indexTotal) {
      return { state: `in processing at ${this.indexTotal}` };
    }

    getMongoRepository(MovieEntity)
      .createEntityCursor()
      .forEach(async movie => {
        const hasImage = movie.images[0];
        const summary: Summary = {
          id: movie.id,
          type: 'movie',
          image: hasImage.url,
          title: movie.title,
          year: movie.year,
          rating: movie.rating.star,
          hot: movie.rating.total,
          keywords: movie.types,
          description: movie.description
        };
        const entity = await SummaryEntity.findOne({ id: movie.id });
        if (entity) {
          SummaryEntity.update({ id: movie.id }, summary)
            .then(v => logger.info(`Admin.index ${movie.id}: Update movie index ${++this.indexTotal}`));
        } else {
          SummaryEntity.insert(summary)
            .then(v => logger.info(`Admin.index ${movie.id}: Insert movie index ${++this.indexTotal}`));
        }
      });

    return { state: `starting index at ${new Date().toLocaleString()}` };

  }

}
