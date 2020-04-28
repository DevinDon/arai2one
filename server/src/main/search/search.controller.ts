import { Controller } from '@rester/core';
import { SummaryEntity } from '../summary/summary.model';

@Controller()
export class SearchController {

  async search(keyword: string): Promise<SummaryEntity[]> {
    return SummaryEntity
      .find({
        where: {
          title: { $regex: new RegExp(`.*${keyword}.*`) }
        }
      });
  }

}
