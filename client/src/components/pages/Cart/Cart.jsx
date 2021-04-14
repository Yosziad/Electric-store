import React, {
	useEffect,
	useState,
	useCallback,
	useMemo,
} from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
	Button, Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	Tooltip,
	Divider,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';

import './Cart.scss';

import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import SearchLocationInput from '../../partials/SearchLocationInput/SearchLocationInput';
import { clearCartAction, clearProduct } from '../../../store/actions/cartAction';
import useWindowDimensions from '../../../assests/hooks/useWindowDimensions';
import Header from '../../partials/Header/Header';
import createOrder from '../../../utils/api/order/order';
import { quantityUpdate } from '../../../utils/api/product/product';

const DELIVERY_COST = 15;

const RemoveProductBtn = ({ onClick, productId }) => {
	const removeItem = useCallback(() => {
		onClick(productId);
	}, [onClick, productId]);
	return (
		<IconButton size="small" onClick={removeItem}>
			<Tooltip title="remove">
				<HighlightOffOutlinedIcon />
			</Tooltip>
		</IconButton>
	);
};

RemoveProductBtn.propTypes = {
	onClick: PropTypes.func.isRequired,
	productId: PropTypes.string.isRequired,
};

const Cart = () => {
	const [sum, setSum] = useState(0);
	const [address, setAddress] = useState('');
	const [isAddress, setIsAddress] = useState(false);
	const onAddressChange = useCallback((e) => {
		setAddress(e.target.value);
	}, []);

	useEffect(() => {
		if (address.length > 0) {
			setIsAddress(true);
		}
	}, [address.length]);

	const { width } = useWindowDimensions();
	const dispatch = useDispatch();
	const history = useHistory();
	const cartItems = useSelector(
		(state) => get(state, 'cartReducer.cartItems', {}),
		shallowEqual,
	);
	const user = useSelector(
		(state) => get(state, 'currentUserReducer.user', {}),
		shallowEqual,
	);

	useEffect(() => {
		const totalSum = cartItems.reduce((totalPrice, cartItem) => (
			totalPrice
				+ get(cartItem, 'product.price', 0) * get(cartItem, 'quantity', 0)
		), 0);
		setSum(totalSum);
	}, [cartItems]);

	const itemQuantityUpdate = useMemo(() => cartItems.map((cartItem) => {
		const newQuantity = cartItem.product.quantity - cartItem.quantity;
		return { id: cartItem.product._id, quantity: newQuantity };
	}), [cartItems]);

	const onHome = useCallback(() => {
		history.push('/');
	}, [history]);

	const onClear = useCallback(() => {
		dispatch(clearCartAction());
	}, [dispatch]);

	const onSubmit = useCallback(async () => {
		let userId;
		if (user.source === 'Google' || user.source === 'Facebook') {
			userId = user.sourceId;
		} else {
			userId = user._id;
		}
		try {
			await createOrder(userId, address, cartItems);
			itemQuantityUpdate.forEach((item) => quantityUpdate(item));
			toast('ההזמנה בוצעה בהצלחה');
			onClear();
		} catch (err) {
			toast.error('שגיאה בעת ביצוע ההזמנה');
		}
	}, [address, cartItems, itemQuantityUpdate, onClear, user._id, user.source, user.sourceId]);

	const onProductClear = useCallback((id) => {
		dispatch(clearProduct(id));
	}, [dispatch]);

	return (
		<div>
			{cartItems.length > 0 ? (
				<div>
					<Header />
					<Grid
						container
						direction="row"
						alignItems="flex-start"
						justify="center"
						className="cart-page"
					>
						<Grid item md={12}>
							<Typography variant="h1" className="title">
								העגלה שלך
							</Typography>
						</Grid>
						<Grid
							container
							direction="row"
							alignItems="flex-start"
							justify="center"
							className="table-container"
							spacing={1}
						>
							<Grid item md={8} xs={10} className="right-side">
								<TableContainer component={Paper}>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>מוצר</TableCell>
												{width > 550 ? <TableCell /> : null}
												<TableCell>מחיר</TableCell>
												<TableCell>כמות</TableCell>
												<TableCell>מחיר כולל</TableCell>
												<TableCell />
											</TableRow>
										</TableHead>
										<TableBody>
											{cartItems.map((cartItem) => (
												<TableRow key={cartItem.product._id}>
													{width > 550 ? (
														<TableCell>
															<img
																src={cartItem.product.pictureUrl}
																alt={cartItem.product.name}
															/>
														</TableCell>
													) : null}
													<TableCell>{cartItem.product.name}</TableCell>
													<TableCell>{`${cartItem.product.price} ₪`}</TableCell>
													<TableCell>{cartItem.quantity}</TableCell>
													<TableCell>
														{`${
															cartItem.product.price * cartItem.quantity
														} ₪`}
													</TableCell>
													<TableCell>
														<RemoveProductBtn
															onClick={onProductClear}
															productId={cartItem.product._id}
														/>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							</Grid>
							<Grid item md={4} xs={10} className="left-side">
								<Paper className="sum-container">
									<Grid className="row">
										סיכום ההזמנה
									</Grid>
									<Divider />
									<Grid className="row">
										<Grid>סכום</Grid>
										<Grid>{`${sum} ₪`}</Grid>
									</Grid>
									<Divider />
									<Grid className="row">
										<Grid>משלוח</Grid>
										<Grid>{`${DELIVERY_COST} ₪`}</Grid>
									</Grid>
									<Divider />
									<Grid className="row">
										<Grid>סכום כולל</Grid>
										<Grid>{`${sum + DELIVERY_COST} ₪`}</Grid>
									</Grid>
									<Divider />
									<Grid className="row">
										<SearchLocationInput
											handleChange={onAddressChange}
											query={address}
											setQuery={setAddress}
										/>
									</Grid>
								</Paper>
								<Button variant="contained" color="primary" className="order-btn" onClick={onSubmit} disabled={!isAddress}>
									בצע הזמנה
								</Button>
								<Button variant="contained" color="secondary" className="order-btn" onClick={onClear}>
									נקה את העגלה
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</div>
			) : (
				<div className="cart-container">
					<img
						src="/img/empty-cart.png"
						alt="empty-cart"
						className="empty-cart"
					/>
					<Button
						onClick={onHome}
						variant="contained"
						color="secondary"
						className="home-btn"
					>
						לחזרה לדף הבית
					</Button>
				</div>
			)}
			<ToastContainer />
		</div>
	);
};

export default Cart;
