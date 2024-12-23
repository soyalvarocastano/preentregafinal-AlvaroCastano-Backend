export default class Service {
  constructor(model){
    this.model = model;
  }

  async getAll() {
    return await this.model.find()
  }

  async getAllWithFilters(query, options) {
    let sort = {};
    let limit = 10;
    let skip = 0;

    if (options?.page && options?.pageSize) {
      skip = (options.page - 1) * options.pageSize;
      limit = options.pageSize;
    }

    if (options?.sortBy) {
      const sortDirection = options.sort === 'asc' ? 1 : -1;
      sort[options.sortBy] = sortDirection;
    }

    const totalCount = await this.model.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    const hasPrevPage = options.page > 1;
    const hasNextPage = options.page < totalPages;

    const prevLink = hasPrevPage ? `/api/${this.model.modelName}?page=${options.page - 1}&pageSize=${limit}` : null;
    const nextLink = hasNextPage ? `/api/${this.model.modelName}?page=${options.page + 1}&pageSize=${limit}` : null;

    const products = await this.model.find(query).sort(sort).skip(skip).limit(limit);

    return {
      status: 'success',
      payload: products,
      totalPages: totalPages,
      prevPage: hasPrevPage ? options.page - 1 : null,
      nextPage: hasNextPage ? options.page + 1 : null,
      page: options.page,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink
    };
  }


  async getById(id) {
    return await this.model.findById(id); 
  }

  async create(data) {
    return await this.model.create(data);
  }

  async update(id, data) {
    return await this.model.updateOne({ _id: id }, data);    
  }

  async delete(id) {
    return await this.model.deleteOne({ _id: id });    
  }
}
