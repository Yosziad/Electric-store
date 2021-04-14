import React, {
	useCallback, useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import {
	Tv,
	PhoneAndroid,
	PhotoCamera,
	Print,
	SportsEsports,
} from '@material-ui/icons';
import {
	Divider,
	MenuList,
	MenuItem,
	Popover,
	Button,
} from '@material-ui/core';

const HeaderCategories = () => {
	const [categoryPopList, setCategoryPopList] = useState(null);

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

	const onCategories = (event) => {
		setCategoryPopList(event.currentTarget);
	};

	const onCategoriesClose = () => {
		setCategoryPopList(null);
	};

	const openCategorys = Boolean(categoryPopList);
	const idCategoryPop = openCategorys ? 'simple-popover' : undefined;
	return (
		<div>
			<Button
				size="medium"
				className="appbar-button"
				onClick={onCategories}
			>
				קטגוריות
			</Button>
			<Popover
				id={idCategoryPop}
				className="category-menu"
				open={openCategorys}
				anchorEl={categoryPopList}
				onClose={onCategoriesClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
			>
				<div className="user-menu-container">
					<MenuList className="menu-list">
						<MenuItem className="MenuItem" onClick={onTvCategory}>
							טלוויזיות
							<Tv fontSize="small" />
						</MenuItem>
						<Divider />
						<MenuItem className="MenuItem" onClick={onPhoneCategory}>
							פלאפונים
							<PhoneAndroid fontSize="small" />
						</MenuItem>
						<Divider />
						<MenuItem className="MenuItem" onClick={onCamCategory}>
							מצלמות
							<PhotoCamera fontSize="small" />
						</MenuItem>
						<Divider />
						<MenuItem className="MenuItem" onClick={onPrintCategory}>
							מדפסות
							<Print fontSize="small" />
						</MenuItem>
						<Divider />
						<MenuItem className="MenuItem" onClick={onConsoleCategory}>
							קונסולות
							<SportsEsports fontSize="small" />
						</MenuItem>
					</MenuList>
				</div>
			</Popover>
		</div>
	);
};

export default HeaderCategories;
