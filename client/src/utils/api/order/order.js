import axios from 'axios';
import get from 'lodash/get';

const createOrder = async (userId, address, products) => {
	let response;
	try {
		response = await axios.post('/order', { userId, address, products });
	} catch (error) {
		return error;
	}
	return response;
};

const getUserOrders = async (userId) => {
	let orders;
	try {
		orders = await axios.get(`/order/userOrders?id=${userId}`);
	} catch (error) {
		return error;
	}
	return get(orders, 'data.foundOrders');
};

export default createOrder;

export { getUserOrders };
