const Product = require('../model/product');
const Logger = require('../services/logger_services');

const logger = new Logger('app');

const newProductValidation = (product) => {
  if (!product.name) {
    throw new Error('name field is empty');
  }
  if ((typeof (product.price) !== 'number') || (product.price < 0)) {
    throw new Error('price field is not a number');
  }
  if ((typeof (product.quantity) !== 'number') || (product.quantity < 0)) {
    throw new Error('Quantity field is not a number');
  }
  if (!product.pictureUrl) {
    throw new Error('pictureUrl field is empty');
  }
  if (!product.category) {
    throw new Error('category field is empty');
  }
  if (!product.description) {
    throw new Error('description field is empty');
  }
};

const createProduct = async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    quantity: req.body.quantity,
    pictureUrl: req.body.pictureUrl,
    description: req.body.description,
    views: 0,
    date: Date.now(),
  });

  logger.info('handling create a product request', product);

  try {
    newProductValidation(product);
  } catch (err) {
    logger.error(err, product);
    return res.status(400).send('Error: creating a new product failed');
  }
  try {
    await product.save();
  } catch (err) {
    logger.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
  logger.info('added product successfully', product);
  return res.send('added product successfully');
};

const getProducts = async (req, res) => {
  let foundProducts;
  try {
    foundProducts = await Product.find().exec();
  } catch (err) {
    logger.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
  if (!foundProducts) {
    logger.error('There are no products to fetch');
    return res.status(404).json({
      message: 'There are no products to fetch',
    });
  }
  logger.info('Fetching all products');
  return res.status(200).json({
    message: 'Products details',
    foundProducts,
  });
};

const getProductByViews = async (req, res) => {
  let foundProducts;
  try {
    foundProducts = await Product.find({}).sort([['views', -1]]).limit(10).exec()
  } catch (err) {
    logger.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
  if (!foundProducts) {
    logger.error('There are no products to fetch');
    return res.status(404).json({
      message: 'There are no products to fetch',
    });
  }
  logger.info('Fetching all products');
  return res.status(200).json({
    message: 'Products details',
    foundProducts,
  });
};

const getProductById = async (req, res) => {
  const id = req.params.productId;
  let foundProduct;
  try {
    foundProduct = await Product.findById(id).exec();
  } catch (err) {
    logger.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
  if (!foundProduct) {
    logger.error('Product id does not exist');
    return res.status(404).json({
      message: 'Product id does not exist',
    });
  }
  logger.info(`Product with ${id} id was fetched`, foundProduct);
  return res.status(200).json({
    message: 'Product details',
    foundProduct,
  });
};

const getProductByCategory = async (req, res) => {
  const category = req.params.category;
  const page = req.query.page;
  let foundProducts;
  try {
    foundProducts = await Product.find({ category: category }).sort([['date', -1]]).skip(page*6).limit(6).exec();
  } catch (err) {
    logger.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
  if (!foundProducts) {
    logger.error('There are no products to fetch');
    return res.status(404).json({
      message: 'There are no products to fetch',
    });
  }
  logger.info('Fetching all products');
  return res.status(200).json({
    message: 'products details',
    foundProducts,
  });
};

const updateProduct = async (req, res) => {
  const id = req.params.productId;
  const props = req.body;
  let result;
  try {
    result = await Product.update({ _id: id }, props).exec();
  } catch (err) {
    logger.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
  if (!result) {
    logger.error('Failed to find and update the product');
    return res.status(404).json({
      message: 'Failed to find and update the product',
    });
  }
  logger.info(`Product with ${id} id was updated`, result);
  return res.status(200).json({
    message: 'המוצר עודכן בהצלחה',
  });
};

const deleteProduct = async (req, res) => {
  const id = req.params.productId;
  let result;
  try {
    result = await Product.remove({ _id: id }).exec();
  } catch (err) {
    logger.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
  if (!result) {
    logger.error('Failed to find and delete the product');
    return res.status(404).json({
      message: 'מחיקת המוצר נכשלה',
    });
  }
  logger.info(`Product with ${id} id was deleted`, result);
  return res.status(200).json({
    message: 'המוצר נמחק בהצלחה',
  });
};

const searchProducts = async (req, res) => {
  const word = req.query.word;
  let foundProducts;
  const regex = new RegExp(`${word}`);
  try {
    foundProducts = await Product.find({ name: regex }).sort([['views', -1]]).limit(7).exec()
  } catch (err) {
    logger.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
  if (!foundProducts) {
    logger.error('There are no products to fetch');
    return res.status(404).json({
      message: 'There are no products to fetch',
    });
  }
  logger.info('Fetching all products');
  return res.status(200).json({
    message: 'Products details',
    foundProducts,
  });
};

module.exports = {
  deleteProduct,
  createProduct,
  updateProduct,
  getProductById,
  getProducts,
  getProductByCategory,
  getProductByViews,
  searchProducts
};
