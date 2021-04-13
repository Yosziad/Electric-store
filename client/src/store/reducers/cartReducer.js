const defaultState = {
	cartItems: [],
};

const cartReducer = (state = defaultState, action) => {
	let itemFound;
	switch (action.type) {
	case 'ADD_TO_CART':
		if (action.payload) {
			itemFound = state.cartItems.find((item) => (
				item.product._id === action.payload[0].product._id));
			if (itemFound) {
				const newQuantity = itemFound.quantity + action.payload[0].quantity;
				const newProduct = action.payload[0].product;
				const newCartItem = { product: newProduct, quantity: newQuantity };
				return {
					...state,
					cartItems: state.cartItems.filter((item) => (
						item.product._id !== itemFound.product._id)).concat(newCartItem),
				};
			}
			return {
				...state,
				cartItems: state.cartItems.concat(action.payload),
			};
		}
		return state;
	case 'CLEAR_CART':
		return {
			...state,
			cartItems: [],
		};

	case 'CLEAR_PRODUCT':
		return {
			...state,
			cartItems: state.cartItems.filter((item) => item.product._id !== action.payload.id),
		};
	default:
		return state;
	}
};

export default cartReducer;
