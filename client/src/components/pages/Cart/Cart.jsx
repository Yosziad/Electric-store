/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState, useCallback } from 'react';
import get from 'lodash/get';
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
import SearchLocationInput from '../../partials/SearchLocationInput';
import { clearCartAction, clearProduct } from '../../../store/actions/cartAction';
import useWindowDimensions from '../../../assests/hooks/useWindowDimensions';
import Header from '../../partials/Header';
import API from '../../../utils/api';

const DELIVERY_COST = 15;

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

	const quantityUpdate = cartItems.map((cartItem) => {
		const newQuantity = cartItem.product.quantity - cartItem.quantity;
		return { id: cartItem.product._id, quantity: newQuantity };
	});

	const success = () => toast('ההזמנה בוצעה בהצלחה');

	const onHome = useCallback(() => {
		history.push('/');
	}, [history]);

	const onClear = () => {
		dispatch(clearCartAction());
	};

	const onSubmit = () => {
		let userId;
		if (user.source === 'Google' || user.source === 'Facebook') {
			userId = user.sourceId;
		} else {
			userId = user._id;
		}
		API.createOrder(userId, address, cartItems);
		quantityUpdate.forEach((item) => API.quantityUpdate(item));
		success();
		onClear();
	};

	const onProductClear = (id) => {
		dispatch(clearProduct(id));
	};

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
														<IconButton size="small" onClick={() => onProductClear(cartItem.product._id)}>
															<Tooltip title="remove">
																<HighlightOffOutlinedIcon />
															</Tooltip>
														</IconButton>
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
