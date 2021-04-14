import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import {
	Typography,
	TableBody,
	TableRow,
	TableCell,
	TableContainer,
	Table,
	TableHead,
	Paper,
} from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../partials/Header/Header';
import getUserOrders from '../../../utils/api/user/user';
import './Orders.scss';

const sumReducer = (sum, orderedProduct) => (sum + (get(orderedProduct, 'quantity', 0) * get(orderedProduct, 'product.price', 0)));

const OrderEntry = ({ order }) => {
	const date = new Date(order.date);
	const dateString = date.toLocaleDateString('he-IL', {
		timeZone: 'Asia/Jerusalem',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});
	const totalPrice = order.products.reduce(sumReducer, 0);

	return (
		<TableRow key={order._id}>
			<TableCell component="th" scope="row">
				<div
					className="text-container"
					title={order._id}
				>
					{order._id}
				</div>
			</TableCell>
			<TableCell align="right">{dateString}</TableCell>
			<TableCell align="right">
				{order.products.length}
			</TableCell>
			<TableCell align="right">{totalPrice}</TableCell>
		</TableRow>
	);
};

OrderEntry.propTypes = {
	order: PropTypes.shape({
		products: PropTypes.arrayOf(PropTypes.object).isRequired,
		_id: PropTypes.string.isRequired,
		date: PropTypes.string.isRequired,
	}).isRequired,
};

const Orders = () => {
	const [orders, setOrders] = useState([]);

	const user = useSelector(
		(state) => get(state, 'currentUserReducer.user', {}),
		shallowEqual,
	);

	const getOrders = useCallback(async () => {
		let userId;
		if (user.source === 'Google' || user.source === 'Facebook') {
			userId = user.sourceId;
		} else {
			userId = user._id;
		}
		let foundOrders;
		try {
			foundOrders = await getUserOrders(userId);
			setOrders(foundOrders);
		} catch (err) {
			toast.error('שגיאה בעת בקשת הנתונים, נסה שנית מאוחר יותר');
		}
	}, [user._id, user.source, user.sourceId]);

	useEffect(() => {
		if (user.userName) {
			getOrders(user.userName);
		}
	}, [getOrders, user.userName]);

	return (
		<div className="orders-page">
			<Header />
			<Typography variant="h1" className="orders-title">
				ההזמנות של
				{' '}
				{user.firstName}
			</Typography>
			<TableContainer component={Paper} className="table-container">
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>מס&apos; הזמנה</TableCell>
							<TableCell align="right">תאריך הזמנה</TableCell>
							<TableCell align="right">מס&apos; מוצרים</TableCell>
							<TableCell align="right">סכום הזמנה</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{orders.length > 0 && orders.map((order) => <OrderEntry order={order} />)}
					</TableBody>
				</Table>
			</TableContainer>
			<ToastContainer />
		</div>
	);
};

export default Orders;
