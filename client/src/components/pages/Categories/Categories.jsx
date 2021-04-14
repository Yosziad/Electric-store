import React, {
	useEffect, useState, useCallback,
} from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import {
	useParams,
} from 'react-router';
import get from 'lodash/get';
import {
	Grid, Button, Dialog, DialogTitle,
	DialogContent, TextField, DialogActions, InputAdornment,
} from '@material-ui/core';
import Loader from 'react-loaders';
import { FaPlus, FaUndo, FaSave } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../partials/Header/Header';
import ProductCard from '../../common/ProductCard/ProductCard';
import CategoryTitle from '../../partials/CategoryTitle/CategoryTitle';
import createProduct, { getProductByCategory } from '../../../utils/api/product/product';
import './Categories.scss';

const Categories = () => {
	const title = useParams();
	const [products, setProducts] = useState([]);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	// Add new product credentials
	const [name, setName] = useState('');
	const onNameChange = useCallback((e) => setName(e.target.value), []);
	const [price, setPrice] = useState('');
	const onPriceChange = useCallback((e) => setPrice(+e.target.value), []);
	const [quantity, setQuantity] = useState('');
	const onQuantityChange = useCallback((e) => setQuantity(+e.target.value), []);
	const [pictureUrl, setPictureUrl] = useState('');
	const onPictureUrlChange = useCallback((e) => setPictureUrl(e.target.value), []);
	const [description, setDescription] = useState('');
	const onDescriptionChange = useCallback((e) => setDescription(e.target.value), []);

	const handleScroll = () => {
		if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
			setPage((prev) => prev + 1);
		}
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll, {
			passive: true,
		});

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	// Fetching the products
	useEffect(() => {
		const getProducts = async () => {
			setLoading(true);
			const newProducts = await getProductByCategory(title.category, page);
			if (!newProducts.isAxiosError) {
				if (newProducts.length === 0) {
					setHasMore(false);
				}
				setProducts((prev) => [...prev, ...newProducts]);
				setLoading(false);
			}
		};
		if (title.category && hasMore) {
			getProducts();
		}
	}, [title.category, page, hasMore]);

	const user = useSelector(
		(state) => get(state, 'currentUserReducer.user', {}),
		shallowEqual,
	);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const success = (msg) => toast(msg);
	const error = () => toast('Error!');

	const onClear = useCallback(async () => {
		setName('');
		setPrice('');
		setQuantity('');
		setPictureUrl('');
		setDescription('');
	}, []);

	const onAdd = useCallback(async () => {
		let response;
		try {
			response = await createProduct(
				name, price, title.category, quantity, pictureUrl, description,
			);
		} catch (err) {
			error();
		}
		success(response);
		handleClose();
		onClear();
	}, [description, name, onClear, pictureUrl, price, quantity, title.category]);

	return (
		<div className="category-page">
			<Header />
			<CategoryTitle title={title.category} />
			{user.role === 'Admin'
				? (
					<Button size="medium" variant="contained" className="new-product-btn" onClick={handleClickOpen}>
						הוסף מוצר חדש
						<FaPlus />
					</Button>
				)
				: null}
			<Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="form-dialog-title">
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
							value={quantity}
							onChange={onQuantityChange}
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
					<Button onClick={onClear} variant="contained" className="btn clear">
						נקה
						<FaUndo />
					</Button>
					<Button onClick={onAdd} variant="contained" color="primary" className="btn add">
						הוסף מוצר
						<FaSave />
					</Button>
				</DialogActions>
			</Dialog>
			<ToastContainer />
			<Grid container className="grid-container" spacing={2}>
				{products.map((product) => (
					<Grid className="card-container" key={product._id} item xs={12} lg={2} md={4} sm={5}>
						<ProductCard
							productId={product._id}
							img={product.pictureUrl}
							price={product.price}
							title={product.name}
							alt={title.category}
							views={product.views}
						/>
					</Grid>
				))}
				{loading && <Loader type="ball-pulse" color="rgb(114, 193, 244)" className="loader-active" />}
			</Grid>
		</div>
	);
};

export default Categories;
