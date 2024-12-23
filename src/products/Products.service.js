import { productModel } from "../products/models/product.model.js";
import Service from "../utils/service.js";

export default class ProductService extends Service {
  constructor() {
    super(productModel);
  }

  async getAllProducts(options) {
    let query = {};

    if (options?.category) {
      query.category = options.category;
    }
   

    return await this.getAllWithFilters(query, options);
  }
}
