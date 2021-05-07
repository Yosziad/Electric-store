import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
	Card, CardActionArea, CardContent, CardMedia, Typography,
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
					height="220"
					width="220"
					image={img}
					title={alt}
				/>
				<CardContent className="card-content">
				<div className="item-title-container">
						<Typography className="item-title"  component="span">
							{title}
						</Typography>
					</div>

					<div className="item-price-container">
						<Typography className="item-price" component="span">
							{`₪${price}`}
						</Typography>
					</div>

					<div className="item-shipping-container">
						<Typography className="item-shipping" component="span">
							{`+ משלוח: ₪15`}
						</Typography>
					</div>

					<div className="item-sold-container">
						<Typography className="item-sold" component="span">
							{`נמכרו 123`}
						</Typography>
					</div>
				</CardContent>
			</CardActionArea>
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
