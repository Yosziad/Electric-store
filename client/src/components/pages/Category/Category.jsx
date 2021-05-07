import React, {
	useCallback,
	useEffect, useState,
} from 'react';
import {
	useParams,
} from 'react-router';
import {	Grid	} from '@material-ui/core';
import Loader from 'react-loaders';
import Header from '../../partials/Header/Header';
import ProductCard from '../../common/ProductCard/ProductCard';
import CategoryTitle from '../../partials/CategoryTitle/CategoryTitle';
import { getProductByCategory } from '../../../utils/api/product/product';
import './Category.scss';

const Categories = () => {
	const { category } = useParams();
	const [products, setProducts] = useState([]);
	const [isProductsLoading, setIsProductsLoading] = useState(true);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);

	const handleScroll = useCallback(() => {
		if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
			setPage((prev) => prev + 1);
		}
	}, []);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll, {
			passive: true,
		});

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [handleScroll]);
	// Fetching the products
	useEffect(() => {
		const getProducts = async () => {
			setIsProductsLoading(true);
			const newProducts = await getProductByCategory(category, page);
			if (!newProducts.isAxiosError) {
				if (newProducts.length === 0) {
					setHasMore(false);
				} else {
					setProducts((prev) => [...prev, ...newProducts]);
				}
				setIsProductsLoading(false);
			}
		};
		if (category && hasMore) {
			getProducts();
		}
	}, [category, page, hasMore]);

	return (
		<div className="category-page">
			<Header />
			<CategoryTitle title={category} />
			<Grid container className="grid-container" spacing={2}>
				{products.map((product) => (
					<Grid className="card-container" key={product._id} item xs={6} sm={4} md={3} lg={2} >
						<ProductCard
							productId={product._id}
							img={product.pictureUrl}
							price={product.price}
							title={product.name}
							alt={product.name}
							views={product.views}
						/>
					</Grid>
				))}
				{isProductsLoading && <Loader type="ball-pulse" color="rgb(114, 193, 244)" className="loader-active" />}
			</Grid>
		</div>
	);
};

export default Categories;
