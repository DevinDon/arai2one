import { DoubanCrawler } from '@iinfinity/movie-crawler';
import { GET, Inject, PUT, View } from '@rester/core';
import { MovieController } from '../movie/movie.controller';

@View('admin')
export class AdminView {

  @Inject() private douban!: DoubanCrawler;
  @Inject() private movie!: MovieController;

  private total: number = 0;

  @PUT('update')
  async update() {

    const tags = ['热门', '最新', '经典', '可播放', '豆瓣高分', '冷门佳片', '华语', '欧美', '韩国', '日本', '动作', '喜剧', '爱情', '科幻', '悬疑', '恐怖', '文艺'];
    const step = 10;

    for (const tag of tags) {
      for (let i = 0; i < 10 * 100; i += step) {
        const results = await this.douban.suggest(tag as any, i, step);
        const works = results.map(result => this.movie.getDetail(result.id)).filter(v => v);
        const last = await Promise.all(works);
        this.total += step;
      }
    }

    return { update: new Date().toLocaleString() };

  }

  @GET('update')
  async getSchedule() {
    return this.total;
  }

}
