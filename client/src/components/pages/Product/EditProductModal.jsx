import React, {
	useState,
	useCallback,
} from 'react';
import { useParams } from 'react-router';
import {
	TextField,
	Dialog,
	DialogTitle,
	DialogContent,
	InputAdornment,
	DialogActions,
	Button,
	Grid,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { FaSave } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { updateProduct } from '../../../utils/api/product/product';

const EditProduct = ({ product, onClose, isOpen }) => {
	const [name, setName] = useState(product.name);
	const onNameChange = useCallback((e) => setName(e.target.value), []);
	const [price, setPrice] = useState(product.price);
	const onPriceChange = useCallback((e) => setPrice(+e.target.value), []);
	const [productQuantity, setProductQuantity] = useState(product.quantity);
	const onProductQuantityChange = useCallback((e) => setProductQuantity(+e.target.value), []);
	const [pictureUrl, setPictureUrl] = useState(product.pictureUrl);
	const onPictureUrlChange = useCallback((e) => setPictureUrl(e.target.value), []);
	const [description, setDescription] = useState(product.description);
	const onDescriptionChange = useCallback((e) => setDescription(e.target.value), []);

	const { productId } = useParams();

	const onUpdate = useCallback(async () => {
		let response;
		try {
			response = await updateProduct(
				productId, {
					name, price, productQuantity, pictureUrl, description,
				},
			);
		} catch (err) {
			toast.error('שגיאה בעת עדכון המוצר');
		}
		toast(response.message);
		onClose();
	}, [description, name, onClose, pictureUrl, price, productId, productQuantity]);

	return (
		<div>
			<Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="form-dialog-title">
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
					<Button onClick={onUpdate} variant="contained" color="primary" className="btn add">
						עדכן
						<FaSave />
					</Button>
				</DialogActions>
			</Dialog>
			<ToastContainer />
		</div>
	);
};

EditProduct.propTypes = {
	product: PropTypes.shape({
		name: PropTypes.string.isRequired,
		price: PropTypes.number.isRequired,
		quantity: PropTypes.number.isRequired,
		pictureUrl: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
	}).isRequired,
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default EditProduct;
