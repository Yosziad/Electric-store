import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useParams } from 'react-router';
import get from 'lodash/get';
import {
	Typography,
	CardMedia,
	Popover,
	Fade,
	IconButton,
	TextField,
	Dialog,
	DialogTitle,
	DialogContent,
	InputAdornment,
	DialogActions,
} from '@material-ui/core';
import { AiOutlineClose } from 'react-icons/ai';
import { IoAddCircleSharp, IoRemoveCircleSharp } from 'react-icons/io5';
import { FaSave } from 'react-icons/fa';
import { MdModeEdit, MdDelete, MdAddShoppingCart } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import { getProductById, updateProduct, deleteProduct } from '../../../utils/api/product/product';
import doesCookieExist from '../../../utils/doesCookieExist';
import './Product.scss';

import cartAction from '../../../store/actions/cartAction';
import Header from '../../partials/Header/Header';

const loginImg = '/img/logo.png';

const Product = () => {
	const [product, setProduct] = useState({});
	const [quantity, setQuantity] = useState(0);
	const [isSigned, setIsSigned] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);

	const user = useSelector(
		(state) => get(state, 'currentUserReducer.user', {}),
		shallowEqual,
	);

	const [name, setName] = useState('');
	const onNameChange = useCallback((e) => setName(e.target.value), []);
	const [price, setPrice] = useState('');
	const onPriceChange = useCallback((e) => setPrice(+e.target.value), []);
	const [productQuantity, setProductQuantity] = useState('');
	const onProductQuantityChange = useCallback((e) => setProductQuantity(+e.target.value), []);
	const [pictureUrl, setPictureUrl] = useState('');
	const onPictureUrlChange = useCallback((e) => setPictureUrl(e.target.value), []);
	const [description, setDescription] = useState('');
	const onDescriptionChange = useCallback((e) => setDescription(e.target.value), []);

	const dispatch = useDispatch();

	const { productId } = useParams();

	const history = useHistory();

	useEffect(() => {
		const getProducts = async () => {
			setProduct(await getProductById(productId));
		};

		if (productId) {
			getProducts();
			setName(product.name);
			setPrice(product.price);
			setProductQuantity(product.quantity);
			setPictureUrl(product.pictureUrl);
			setDescription(product.description);
		}
	}, [product.description, product.name, product.pictureUrl,
		product.price, product.quantity, productId]);

	const handleClose = () => {
		setIsSigned(false);
	};

	const onHome = useCallback(() => {
		history.push('/');
	}, [history]);

	const onLogin = useCallback(() => {
		history.push('/login');
	}, [history]);

	const open = isSigned;
	const id = open ? 'simple-popover' : undefined;

	const notSigned = (
		<Popover
			id={id}
			className="product-popover"
			open={open}
			anchorEl={isSigned}
			onClose={handleClose}
			anchorReference="anchorPosition"
			anchorPosition={{ top: 200, left: 700 }}
		>
			<Fade in={open}>
				<Grid item className="popover-container">
					<IconButton
						onClick={handleClose}
						className="close-btn"
					>
						<AiOutlineClose />
					</IconButton>
					<Button onClick={onHome} className="home-btn">
						<img className="image-logo" src={loginImg} alt="login" />
					</Button>
					<Typography variant="h5" className="text">
						עליך להתחבר לאתר על מנת לבצע הזמנה
					</Typography>
					<Button
						size="small"
						className="login-btn"
						variant="contained"
						onClick={onLogin}
					>
						התחבר
					</Button>
					<h5>
						אין לך משתמש
						?
						<Link to="../signup">הרשם כאן</Link>
					</h5>
				</Grid>
			</Fade>
		</Popover>
	);

	const onQuantityAdd = useCallback(() => {
		let val = quantity;
		if (quantity < product.quantity) {
			val = quantity + 1;
			setQuantity(val);
		} else {
			setQuantity(product.quantity);
		}
	}, [product.quantity, quantity]);

	const onQuantitySubtract = useCallback(() => {
		let val = quantity;
		if (quantity > 0) {
			val = quantity - 1;
		}
		setQuantity(val);
	}, [quantity]);

	const onAddToCart = useCallback(() => {
		if (doesCookieExist('token')) {
			dispatch(cartAction(product, quantity));
		} else {
			setIsSigned(true);
		}
	}, [dispatch, product, quantity]);

	const success = (msg) => toast(msg);
	const updateError = () => toast('Error!');

	const handleClickOpen = () => {
		setOpenEdit(true);
	};

	const handleEditClose = () => {
		setOpenEdit(false);
	};

	const onAdd = useCallback(async () => {
		let response;
		try {
			response = await updateProduct(
				productId, {
					name, price, productQuantity, pictureUrl, description,
				},
			);
		} catch (err) {
			updateError();
		}
		success(response.message);
		handleEditClose();
	}, [description, name, pictureUrl, price, productId, productQuantity]);

	const deleteProduct = useCallback(async () => {
		let response;
		try {
			response = await deleteProduct(productId);
		} catch (err) {
			updateError();
		}
		success(response.message);
		history.goBack();
	}, [history, productId]);

	return (
		<div className="product-page">
			<Header />
			<Grid
				container
				direction="row"
				alignItems="center"
				justify="center"
				className={open ? 'blurred' : null}
			>
				<Grid item md={6} className="product-container">
					{user.role === 'Admin'
						? (
							<Button className="edit-btn" title="ערוך מוצר" onClick={handleClickOpen}>
								<MdModeEdit />
							</Button>
						)
						: null}
					<Dialog open={openEdit} onClose={handleEditClose} fullWidth maxWidth="sm" aria-labelledby="form-dialog-title">
						<DialogTitle id="form-dialog-title" className="popover-title">הוספת מוצר חדש</DialogTitle>
						<DialogContent className="dialog-container">
							<Grid container className="text-field-container">
								<TextField
									id="standard-helperText"
									label="שם"
									className="dialog-txt-field"
									value={name}
									onChange={onNameChange}
									variant="filled"
								/>
								<TextField
									id="standard-helperText"
									label="כתובת תמונה(url)"
									className="dialog-txt-field"
									value={pictureUrl}
									onChange={onPictureUrlChange}
									variant="filled"
								/>
								<TextField
									id="standard-helperText"
									label="מחיר"
									className="dialog-txt-field"
									value={price}
									onChange={onPriceChange}
									variant="filled"
									InputProps={{
										endAdornment: <InputAdornment className="input-text" position="end">₪</InputAdornment>,
									}}
								/>
								<TextField
									id="standard-helperText"
									label="כמות"
									className="dialog-txt-field"
									value={productQuantity}
									onChange={onProductQuantityChange}
									variant="filled"
									type="number"
								/>
							</Grid>
							<TextField
								id="standard-helperText"
								label="תאור"
								className="dialog-txt-field"
								value={description}
								onChange={onDescriptionChange}
								variant="filled"
								multiline
								rows={4}
							/>
						</DialogContent>
						<DialogActions className="btn-container">
							<Button onClick={onAdd} variant="contained" color="primary" className="btn add">
								עדכן
								<FaSave />
							</Button>
						</DialogActions>
					</Dialog>
					<ToastContainer />
					<Typography variant="h1" className="title" gutterBottom>
						{product.name}
					</Typography>
					<Typography variant="h5" className="price">
						{product.price}
						.00 ₪
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
						? (
							<Button
								variant="contained"
								className="delete-btn"
								color="secondary"
								onClick={deleteProduct}
							>
								מחק מוצר
								<MdDelete className="icon" />
							</Button>
						)
						: null}
				</Grid>
			</Grid>
			{notSigned}
		</div>
	);
};

export default Product;
