import React, {
	useCallback, useRef, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loaders';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import { AiOutlineRight, AiOutlineLeft } from 'react-icons/ai';
import ProductCard from '../ProductCard/ProductCard';
import { getProductByViews } from '../../../utils/api/product/product';
import useWindowDimensions from '../../../assests/hooks/useWindowDimensions';
import './MostViewedItems.scss';

const MostViewedItems = ({ title }) => {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		const getProducts = async () => {
			setProducts(await getProductByViews());
		};
		getProducts();
	}, []);

	const { width } = useWindowDimensions();

	const ref = useRef(null);

	const scroll = useCallback(
		(isNegative) => {
			const operator = isNegative ? -1 : 1;
			ref.current.scrollLeft += (width * operator) / 2;
		},
		[width],
	);

	const scrollRight = () => {
		scroll(false);
	};
	const scrollLeft = () => {
		scroll(true);
	};

	return (
		<Container maxWidth={false} className="hot-products-container">
			<Grid item xs={12} className="slider-title">
				{title}
			</Grid>
			<Grid item xs={12} className="scroll-btn">
				<Fab onClick={scrollRight} className="scroll-btn-right" size="medium">
					<AiOutlineRight />
				</Fab>
				<Fab onClick={scrollLeft} className="scroll-btn-left" size="medium">
					<AiOutlineLeft />
				</Fab>
			</Grid>
			<Grid container className="products-slider" ref={ref} spacing={3}>
				{products.length > 0
					?	products.map((product) => (
						<Grid item key={product._id} className="card-container">
							<ProductCard
								productId={product._id}
								img={product.pictureUrl}
								price={product.price}
								title={product.name}
								alt={product.name}
								views={product.views}
							/>
						</Grid>
					))
					: <Loader type="ball-spin-fade-loader" color="rgb(114, 193, 244)" className="loader-active" />}
			</Grid>
		</Container>
	);
};

MostViewedItems.propTypes = {
	title: PropTypes.string.isRequired,
};

export default MostViewedItems;
