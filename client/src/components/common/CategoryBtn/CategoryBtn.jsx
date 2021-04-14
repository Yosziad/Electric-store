import React, { useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import { Button, Typography, Divider } from '@material-ui/core';
import TvIcon from '@material-ui/icons/Tv';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import PrintIcon from '@material-ui/icons/Print';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import './CategoryBtn.scss';

const Categorybtn = () => {
	const history = useHistory();

	const onTvCategory = useCallback(() => {
		history.push('/categories/tv');
	}, [history]);

	const onPhoneCategory = useCallback(() => {
		history.push('/categories/phone');
	}, [history]);

	const onCamCategory = useCallback(() => {
		history.push('/categories/camera');
	}, [history]);

	const onConsoleCategory = useCallback(() => {
		history.push('/categories/console');
	}, [history]);

	const onPrintCategory = useCallback(() => {
		history.push('/categories/print');
	}, [history]);

	return (
		<Grid container className="category-btn-group" direction="row">
			<Button className="category-btn" onClick={onTvCategory}>
				<TvIcon fontSize="large" color="primary" />
				<Typography variant="button" display="block" gutterBottom>
					טלוויזיות
				</Typography>
			</Button>
			<Divider orientation="vertical" flexItem />
			<Button className="category-btn" onClick={onPhoneCategory}>
				<PhoneAndroidIcon
					fontSize="large"
					color="primary"
				/>
				<Typography variant="button" display="block" gutterBottom>
					פלאפונים
				</Typography>
			</Button>
			<Divider orientation="vertical" flexItem />
			<Button className="category-btn" onClick={onCamCategory}>
				<PhotoCameraIcon
					fontSize="large"
					color="primary"
				/>
				<Typography variant="button" display="block" gutterBottom>
					מצלמות
				</Typography>
			</Button>
			<Divider orientation="vertical" flexItem />
			<Button className="category-btn" onClick={onPrintCategory}>
				<PrintIcon fontSize="large" color="primary" />
				<Typography variant="button" display="block" gutterBottom>
					מדפסות
				</Typography>
			</Button>
			<Divider orientation="vertical" flexItem />
			<Button className="category-btn" onClick={onConsoleCategory}>
				<SportsEsportsIcon
					fontSize="large"
					color="primary"
				/>
				<Typography variant="button" display="block" gutterBottom>
					קונסולות
				</Typography>
			</Button>
		</Grid>
	);
};

export default Categorybtn;
