const cartAction = (product, quantity) => ({
	type: 'ADD_TO_CART',
	payload: [{
		product,
		quantity,
	}],
});

const clearCartAction = () => ({
	type: 'CLEAR_CART',
});

const clearProduct = (id) => ({
	type: 'CLEAR_PRODUCT',
	payload: {
		id,
	},
});

export default cartAction;

export { clearCartAction, clearProduct };
