import React, {
	useCallback, useEffect, useState, useRef, useMemo,
} from 'react';
import { useHistory } from 'react-router-dom';
import Loader from 'react-loaders';
import { debounce } from 'lodash';
import {
	Divider,
	Button,
	IconButton,
	InputBase,
} from '@material-ui/core';
import { FiSearch } from 'react-icons/fi';
import { searchProduct, viewsUpdate } from '../../../utils/api/product/product';

const Search = () => {
	const [query, setQuery] = useState('');
	const [products, setProducts] = useState([]);
	const [display, setDisplay] = useState(false);

	const history = useHistory();

	const onSearch = useCallback((searchQuery) => {
		const getProducts = async () => {
			if (searchQuery === '') {
				setProducts([]);
				setDisplay(false);
			}	else	{
				setProducts(await searchProduct(searchQuery));
			}
		};
		getProducts();
	}, []);

	const delayedOnSearch = useMemo(() => debounce(onSearch, 800), [onSearch]);

	const onQueryChange = useCallback((event) => {
		setProducts([]);
		setDisplay(true);
		setQuery(event.target.value);
		delayedOnSearch(event.target.value);
	}, [delayedOnSearch]);

	const onProduct = (productId, views) => {
		viewsUpdate(productId, views);
		history.push(`/products/${productId}`);
	};

	function useOutsideAlerter(ref) {
		useEffect(() => {
			function handleClickOutside(event) {
				if (ref.current && !ref.current.contains(event.target)) {
					setDisplay(false);
				}
			}
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}, [ref]);
	}

	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef);

	return (
		<div>
			<div className="search-container">
				<InputBase
					className="search-field"
					placeholder="חיפוש..."
					onChange={onQueryChange}
					value={query}
					inputProps={{ 'aria-label': 'naked' }}
				/>
				<IconButton disabled>
					<FiSearch />
				</IconButton>
			</div>
			{display && (
				<div className="autoContainer">
					{products.length === 0
						? (
							<Loader type="ball-pulse" color="rgb(114, 193, 244)" className="loader-active" />
						)
						:	products.map((product) => (
							<div ref={wrapperRef}>
								<Button className="product" onClick={() => onProduct(product._id, product.views)}>
									<img src={product.pictureUrl} alt={product.name} className="product-img" />
									<span>{product.name}</span>
								</Button>
								<Divider />
							</div>
						))}
				</div>
			)}
		</div>
	);
};

export default Search;
