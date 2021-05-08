import React, {
	useState,
	useEffect,
	useCallback,
} from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import moment from 'moment';
import 'moment/locale/he';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import get from 'lodash/get';
import {
	Typography,
	CardMedia,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { MdDelete, MdAddShoppingCart, MdModeEdit } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import { getProductById, deleteProduct } from '../../../utils/api/product/product';
import './Product.scss';
import cartAction from '../../../store/actions/cartAction';
import Header from '../../partials/Header/Header';
import EditProductModal from './EditProductModal';

moment.locale('he');

const Product = () => {
	const [product, setProduct] = useState({});
	const [quantity, setQuantity] = useState(1);
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
		if (quantity > 1) {
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
		<>
			<Header fixScroll elevation={0} />
			<div className="product-page">
				<Grid container className="product-container">
					{user.role === 'Admin' && (
						<Button className="edit-btn" title="ערוך מוצר" onClick={handleClickOpen}>
							<MdModeEdit />
						</Button>
					)}
					<Grid item md={5} xs={12} className="picture-container">
						<CardMedia
							component="img"
							alt={product.name}
							image={product.pictureUrl}
							title={product.name}
							className="product-img"
						/>
					</Grid>
					<Grid item md={7} xs={12} className="text-container">
						<Typography variant="h1" className="title" gutterBottom>
							{product.name}
						</Typography>
						<Typography variant="body1" component="span" className="orders">
							123 הזמנות
						</Typography>
						<Divider className="divider" />
						<Typography variant="h5" className="price">
							{`${get(product, 'price', 0).toFixed(2)}₪`}
						</Typography>
						<Divider className="divider" />
						<Typography variant="subtitle1" className="description">
							{product.description}
						</Typography>
						<div className="quantity-container">
							<Typography variant="subtitle1" className="quantity-text">
								בחר כמות:
							</Typography>
							<div className="quantity-amount-container">
								<div className="quantity-selector">
									<IconButton color="default" onClick={onQuantitySubtract} className="quantity-btn" aria-label="add item" disabled={quantity <= 1}>
										<RemoveCircleIcon />
									</IconButton>
									<Typography variant="h3" className="quantity">
										{quantity}
									</Typography>
									<IconButton color="default" onClick={onQuantityAdd} className="quantity-btn" aria-label="remove item" disabled={quantity >= product.quantity}>
										<AddCircleIcon />
									</IconButton>
								</div>
								<div className="quantity-amount">
									{`נותרו ${product.quantity} מוצרים`}
								</div>
							</div>
						</div>
						<div className="product-shipping">
							<div className="product-shipping-price">
								<span>משלוח: 15₪</span>
							</div>
							<span className="product-shipping-date">
								<span className="product-shipping-delivery">
									תאריך משואר למשלוח&nbsp;
									<span>{moment().add(1, 'week').format('MMMM, DD')}</span>
								</span>
							</span>
						</div>
						<div className="product-action">
							<Button
								color="primary"
								variant="contained"
								className="add-to-cart"
								onClick={onAddToCart}
							>
								הוסף לסל
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
						</div>
						<Grid container direction="row" className="btn-container">
						</Grid>
					</Grid>
				</Grid>
			</div>
			{!isLoading && (
				<EditProductModal
					product={product}
					onClose={handleEditClose}
					isOpen={isEditModalOpen}
				/>
			)}
			<ToastContainer />
		</>
	);
};

export default Product;
