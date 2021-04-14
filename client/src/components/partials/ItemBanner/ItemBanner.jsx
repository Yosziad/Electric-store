import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import WelcomeCarousel from '../../pages/Carousel/Carousel';
import Categorybtn from '../../common/CategoryBtn/CategoryBtn';
import '../../pages/Home/Home.scss';

const ItemBanner = () => {
	const history = useHistory();

	const onSignup = useCallback(() => {
		history.push('/signup');
	}, [history]);

	return (
		<Grid container direction="row" alignItems="center" justify="center" className="Item-banner-container">
			<Grid item md={6} className="right-side">
				<Typography variant="h1" component="h2" className="title" gutterBottom>
					המוצרים הנמכרים של 2020
				</Typography>
				<Typography variant="subtitle1" gutterBottom>
					בואו להנות מהמוצרים הנמכרים של השנה במכירים מיוחדים
				</Typography>
				<Button variant="contained" color="primary" onClick={onSignup} disableElevation>
					להצטרפות לחץ כאן
				</Button>
			</Grid>
			<Grid item md={6} className="left-side">
				<WelcomeCarousel />
			</Grid>
			<Grid item className="category-btn-container">
				<Categorybtn />
			</Grid>
		</Grid>
	);
};

export default ItemBanner;
