import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
	Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Typography,
} from '@material-ui/core';
import { viewsUpdate } from '../../../utils/api/product/product';
import './ProductCard.scss';

const ProductCard = ({
	productId, img, price, title, alt, views,
}) => {
	const history = useHistory();

	const onProduct = () => {
		viewsUpdate(productId, views);
		history.push(`/products/${productId}`);
	};

	return (
		<Card className="product-card" onClick={onProduct}>
			<CardActionArea>
				<CardMedia
					component="img"
					alt={alt}
					height="140"
					image={img}
					title={alt}
				/>
				<CardContent className="card-content">
					<Typography gutterBottom variant="h5" component="h2">
						{title}
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						{`₪${price}`}
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions className="card-actions">
				<Button size="small" variant="contained" color="primary">
					הוסף לסל
				</Button>
			</CardActions>
		</Card>
	);
};

ProductCard.propTypes = {
	productId: PropTypes.string.isRequired,
	img: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	price: PropTypes.number.isRequired,
	alt: PropTypes.string.isRequired,
	views: PropTypes.number.isRequired,
};

export default ProductCard;
