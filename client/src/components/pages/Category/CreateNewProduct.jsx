import React, {
	useState, useCallback,
} from 'react';
import {
	useParams,
} from 'react-router';
import { useSelector, shallowEqual } from 'react-redux';
import get from 'lodash/get';
import {
	Grid, Button, Dialog, DialogTitle,
	DialogContent, TextField, DialogActions, InputAdornment,
} from '@material-ui/core';
import { FaPlus, FaUndo, FaSave } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import createProduct from '../../../utils/api/product/product';

const CreateNewProduct = () => {
	const { category } = useParams();
	const [isCreateItemOpen, setIsCreateItemOpen] = useState(false);
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
	const user = useSelector(
		(state) => get(state, 'currentUserReducer.user', {}),
		shallowEqual,
	);

	const onClear = useCallback(async () => {
		setName('');
		setPrice('');
		setQuantity('');
		setPictureUrl('');
		setDescription('');
	}, []);

	const handleClickOpen = useCallback(() => {
		setIsCreateItemOpen(true);
	}, []);

	const handleClose = useCallback(() => {
		setIsCreateItemOpen(false);
		onClear();
	}, [onClear]);

	const onAdd = useCallback(async () => {
		try {
			await createProduct(
				name, price, category, quantity, pictureUrl, description,
			);
			toast('המוצר נוצר בהצלחה');
		} catch (err) {
			toast.error('שגיאה בעת יצירת המוצר');
		}
		handleClose();
	}, [handleClose, name, price, category, quantity, pictureUrl, description]);
	return (
		<div>
			{user.role === 'Admin'
				&& (
					<Button size="medium" variant="contained" className="new-product-btn" onClick={handleClickOpen}>
						הוסף מוצר חדש
						<FaPlus />
					</Button>
				)}
			<Dialog open={isCreateItemOpen} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="form-dialog-title">
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
		</div>
	);
};

export default CreateNewProduct;
