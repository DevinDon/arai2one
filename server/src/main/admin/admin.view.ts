import { delay } from '@iinfinity/delay';
import { logger } from '@iinfinity/logger';
import { DoubanCrawler } from '@iinfinity/movie-crawler';
import { GET, Inject, PUT, View } from '@rester/core';
import { MovieController } from '../movie/movie.controller';
import { MovieEntity } from '../movie/movie.model';

@View('admin')
export class AdminView {

  @Inject() private douban!: DoubanCrawler;
  @Inject() private movie!: MovieController;

  private total: number = 0;

  @PUT('update')
  async update() {

    if (this.total !== 0) {
      return { update: `processing ${this.total}` };
    }

    (async () => {
      const tags = ['热门', '最新', '经典', '可播放', '豆瓣高分', '冷门佳片', '华语', '欧美', '韩国', '日本', '动作', '喜剧', '爱情', '科幻', '悬疑', '恐怖', '文艺'];
      const step = 20;

      for (const tag of tags) {
        for (let i = 0; i < 3 * 100; i += step) {
          logger.info(`类别：${tag}，从 ${i} 到 ${i + step}`);
          const results = await this.douban.suggest(tag as any, i, step);
          // const works = results.map(result => this.movie.getDetail(result.id)).filter(v => v);
          // const last = await Promise.all(works).catch(e => logger.error('爬取推荐视频时出错', e));
          for await (const result of results) {
            logger.info(`正在爬取 ${tag} 类别中的第 ${i + 1} 项 ${result.title}，总计第 ${++this.total} 项`);
            if (await MovieEntity.findOne({ id: result.id })) {
              logger.info(`数据库中已有数据，跳过 ${result.title}`);
              continue;
            }
            await this.movie.getDetail(result.id)
              .then(v => logger.info(`${v?.title} 爬取完成，已写入数据库`));
            await delay(10000 + Math.random() * 10000);
          }
          await delay(30 * 1000);
        }
      }
    })();

    return { update: new Date().toLocaleString() };

  }

  @GET('update')
  async getSchedule() {
    return this.total;
  }

}
