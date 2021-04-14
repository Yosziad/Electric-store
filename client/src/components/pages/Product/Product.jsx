import React, {
	useState,
	useEffect,
	useCallback,
} from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import get from 'lodash/get';
import {
	Typography,
	CardMedia,
} from '@material-ui/core';
import { IoAddCircleSharp, IoRemoveCircleSharp } from 'react-icons/io5';
import { MdDelete, MdAddShoppingCart, MdModeEdit } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import { getProductById, deleteProduct } from '../../../utils/api/product/product';
import './Product.scss';
import cartAction from '../../../store/actions/cartAction';
import Header from '../../partials/Header/Header';
import EditProductModal from './EditProductModal';

const Product = () => {
	const [product, setProduct] = useState({});
	const [quantity, setQuantity] = useState(0);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const history = useHistory();

	const user = useSelector(
		(state) => get(state, 'currentUserReducer.user', {}),
		shallowEqual,
	);

	const dispatch = useDispatch();
	const { productId } = useParams();

	useEffect(() => {
		const getProduct = async () => {
			try	{
				const resProduct = await getProductById(productId);
				setProduct(resProduct);
			} catch (err) {
				toast.error('שגיאה בעת בקשת נתונים');
			} finally {
				setIsLoading(false);
			}
		};
		if (productId) {
			getProduct();
		}
	}, [productId]);

	const onQuantityAdd = useCallback(() => {
		if (quantity < product.quantity) {
			setQuantity(quantity + 1);
		}
	}, [product.quantity, quantity]);

	const onQuantitySubtract = useCallback(() => {
		if (quantity > 0) {
			setQuantity(quantity - 1);
		}
	}, [quantity]);

	const onAddToCart = useCallback(() => {
		dispatch(cartAction(product, quantity));
	}, [dispatch, product, quantity]);

	const onDeleteProduct = useCallback(async () => {
		let response;
		try {
			response = await deleteProduct(productId);
		} catch (err) {
			toast.error('שגיאה בעת מחיקת המוצר');
		}
		toast(response.message);
		history.goBack();
	}, [history, productId]);

	const handleClickOpen = useCallback(() => {
		setIsEditModalOpen(true);
	}, []);

	const handleEditClose = useCallback(() => {
		setIsEditModalOpen(false);
	}, []);

	return (
		<div className="product-page">
			<Header />
			<Grid
				container
				direction="row"
				alignItems="center"
				justify="center"
			>
				<Grid item md={6} className="product-container">
					{user.role === 'Admin' && (
						<Button className="edit-btn" title="ערוך מוצר" onClick={handleClickOpen}>
							<MdModeEdit />
						</Button>
					)}
					{!isLoading && (
						<EditProductModal
							product={product}
							onClose={handleEditClose}
							isOpen={isEditModalOpen}
						/>
					)}
					<Typography variant="h1" className="title" gutterBottom>
						{product.name}
					</Typography>
					<Typography variant="h5" className="price">
						{`${get(product, 'price', 0).toFixed(2)}₪`}
					</Typography>
					<Typography variant="subtitle1" className="description">
						{product.description}
					</Typography>
					<CardMedia
						component="img"
						alt={product.name}
						image={product.pictureUrl}
						title={product.name}
						className="product-img"
					/>
					<Grid container direction="row" className="add-to-cart-container">
						<Typography variant="subtitle1" className="choose-quantity">
							בחר כמות:
						</Typography>
						<div className="space-small" />
						<Button onClick={onQuantityAdd} className="add-btn">
							<IoAddCircleSharp />
						</Button>
						<Typography variant="h3" className="quantity">
							{quantity}
						</Typography>
						<Button
							className="add-btn"
							onClick={onQuantitySubtract}
						>
							<IoRemoveCircleSharp />
						</Button>
						<div className="space" />
					</Grid>
					<Button
						variant="contained"
						className="add-to-cart"
						onClick={onAddToCart}
					>
						הוסף לסל
						<MdAddShoppingCart className="icon" />
					</Button>
					{user.role === 'Admin'
						&& (
							<Button
								variant="contained"
								className="delete-btn"
								color="secondary"
								onClick={onDeleteProduct}
							>
								מחק מוצר
								<MdDelete className="icon" />
							</Button>
						)}
				</Grid>
			</Grid>
			<ToastContainer />
		</div>
	);
};

export default Product;
