import axios from 'axios';
import get from 'lodash/get';

const createProduct = async (name, price, category, quantity, pictureUrl, description) => {
	let product;
	try {
		product = await axios.post('/product', {
			name, price, category, quantity, pictureUrl, description,
		});
	} catch (error) {
		return error;
	}
	return get(product, 'data');
};

const updateProduct = async (productId, updateProps) => {
	let product;
	try {
		product = await axios.patch(`/product/${productId}`, { ...updateProps });
	} catch (error) {
		return error;
	}
	return get(product, 'data');
};

const deleteProduct = async (productId) => {
	let product;
	try {
		product = await axios.delete(`/product/${productId}`);
	} catch (error) {
		return error;
	}
	return get(product, 'data');
};

const getProductByViews = async () => {
	let products;
	try {
		products = await axios.get('/product/products');
	} catch (error) {
		return error;
	}
	const hotProducts = get(products, 'data.foundProducts');
	return hotProducts;
};

const searchProduct = async (word) => {
	let products;
	if	(!word) return [];
	try {
		products = await axios.get(`/product/search?word=${word}`);
	} catch (error) {
		return error;
	}
	const foundProducts = get(products, 'data.foundProducts');
	return foundProducts;
};

const getProductByCategory = async (category, page) => {
	let products;
	try {
		products = await axios.get(`/product/categories/${category}?page=${page}`);
	} catch (error) {
		return error;
	}
	return get(products, 'data.foundProducts');
};

const getProductById = async (productId) => {
	let product;
	try {
		product = await axios.get(`/product/${productId}`);
	} catch (error) {
		return error;
	}
	return get(product, 'data.foundProduct');
};

const quantityUpdate = async (newQuantity) => {
	let response;
	try {
		response = await axios.patch(`/product/productUpdate/${newQuantity.id}`, { quantity: newQuantity.quantity });
	} catch (error) {
		return error;
	}
	return response;
};

const viewsUpdate = async (productId, views) => {
	const newViews = views + 1;
	let response;
	try {
		response = await axios.patch(`/product/productUpdate/${productId}`, { views: newViews });
	} catch (error) {
		return error;
	}
	return response;
};

export default createProduct;

export {
	viewsUpdate,
	quantityUpdate,
	getProductById,
	getProductByCategory,
	searchProduct,
	getProductByViews,
	deleteProduct,
	updateProduct,
};
