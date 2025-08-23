import { Query } from 'mongoose';
import { excludeFildes, searcFildes } from './constain';

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    const filter = { ...this.query };
    for (const filed of excludeFildes) {
      delete filter[filed];
    }
    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }

  search(): this {
    const searchQuery = this.query.search || '';
    const search = {
      $or: searcFildes.map((sf) => ({
        [sf]: { $regex: searchQuery, $options: 'i' },
      })),
    };
    this.modelQuery = this.modelQuery.find(search);
    return this;
  }

  pagination(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = Number(page - 1) * limit;
    this.modelQuery = this.modelQuery.limit(limit).skip(skip);
    return this;
  }

  sort(): this {
    const sortQuery = this.query.sort || '-createAt';
    this.modelQuery = this.modelQuery.sort(sortQuery);
    return this;
  }

  select(): this {
    const fildesFilter = this.query.fields?.split(',').join(' ');
    this.modelQuery = this.modelQuery.select(fildesFilter);
    return this;
  }

  build() {
    return this.modelQuery;
  }

  async getMeta(countDocuments: number) {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(countDocuments / limit);
    return { page, limit, totalPage, total: countDocuments };
  }
}
