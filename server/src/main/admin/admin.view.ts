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
          const results = await this.douban.suggest(tag as any, i, step)
            .then(v => (logger.info(`列表获取成功，总计 ${v.length} 项`), v))
            .catch(e => (logger.error(`列表抓取失败，${tag} 类别从第 ${i} 项到第 ${i + step} 项`), []));
          // 没有更多推荐
          if (results.length === 0) { break; }
          // 循环爬取列表详情
          for await (const result of results) {
            logger.info(`正在爬取 ${tag} 类别，总计第 ${++this.total} 项`);
            if (await MovieEntity.findOne({ id: result.id })) {
              logger.info(`数据库中已有数据，跳过 ${result.title}`);
              continue;
            }
            await this.movie.getDetail(result.id)
              .then(v => logger.info(`${v?.title} 爬取完成，已写入数据库`))
              .catch(e => logger.error(`${result.id} ${result.title} 爬取失败，原因：${e.message}`));
            await delay(15000 + Math.random() * 15000);
          }
          // 每次列表间隔 30 秒
          await delay(30 * 1000);
        }
        // 类别间隔 30 秒
        await delay(30 * 1000);
      }
    })();

    return { update: new Date().toLocaleString() };

  }

  @GET('update')
  async getSchedule() {
    return this.total;
  }

}
