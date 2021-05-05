import React, {
	useCallback, useEffect, useState,
} from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import {
	Typography,
	Popover,
	Button,
	IconButton,
	Toolbar,
	AppBar,
	Badge,
} from '@material-ui/core';
import '../../pages/Home/Home.scss';

// icons
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';

import { clearCurrentUserAction } from '../../../store/actions/currentUserAction';
import doesHttpOnlyCookieExist from '../../../utils/doesCookieExist';
import Search from './Search';
import { logout } from '../../../utils/api/user/user';
import HeaderCategories from './HeaderCategories';

const logo = '/img/logo.png';

const UserProfile = ({ onClick }) => {
	const user = useSelector(
		(state) => get(state, 'currentUserReducer.user', {}),
		shallowEqual,
	);
	return user.source === 'Google' ? (
		<IconButton className="loggedin-btn" onClick={onClick}>
			<img src={user.imageUrl} alt="user" className="image-btn" />
		</IconButton>
	) : (
		<IconButton className="loggedin-btn" onClick={onClick}>
			{user.firstName && `${user.firstName.split('')[0]}${user.lastName.split('')[0]}`}
		</IconButton>
	);
};

UserProfile.propTypes = {
	onClick: PropTypes.func.isRequired,
};

const Header = ({fixScroll, elevation}) => {
	const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
	const [token, setToken] = useState(false);

	const history = useHistory();
	const dispatch = useDispatch();

	const user = useSelector(
		(state) => get(state, 'currentUserReducer.user', {}),
		shallowEqual,
	);

	const cartItems = useSelector(
		(state) => get(state, 'cartReducer.cartItems', {}),
		shallowEqual,
	);
	const [itemNum, setItemNum] = useState(0);

	useEffect(() => {
		if (doesHttpOnlyCookieExist('token')) {
			setToken(true);
		} else {
			setToken(false);
		}
	}, []);

	useEffect(() => {
		setItemNum(cartItems.length);
	}, [cartItems]);

	const openUserMenu = (event) => {
		setUserMenuAnchorEl(event.currentTarget);
	};

	const redirectToLogin = useCallback(() => {
		history.push('/login');
	}, [history]);

	const handleClose = () => {
		setUserMenuAnchorEl(null);
	};

	const open = Boolean(userMenuAnchorEl);
	const id = open ? 'simple-popover' : undefined;

	const onLogout = useCallback(() => {
		logout();
		setUserMenuAnchorEl(null);
		setToken(false);
		dispatch(clearCurrentUserAction());
	}, [dispatch]);

	const onOrders = useCallback(() => {
		history.push('/orders');
	}, [history]);

	const onCart = useCallback(() => {
		history.push('/cart');
	}, [history]);

	const onHome = useCallback(() => {
		history.push('/');
	}, [history]);

	const onContact = useCallback(() => {
		history.push('/contact');
	}, [history]);

	const userMenu = (
		<Popover
			id={id}
			className="user-menu"
			open={open}
			anchorEl={userMenuAnchorEl}
			onClose={handleClose}
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
				<div className="signin">
					<div className="profile">
						<FaUserCircle className="user-icon" />
						<Typography variant="h5" className="user-txt">
							{user.firstName}
							{' '}
							{user.lastName}
						</Typography>
						<Typography className="user-txt">{user.userName}</Typography>
					</div>
					<Button onClick={onOrders} className="order-btn" variant="contained">ההזמנות שלי</Button>
					<Button
						className="order-btn"
						variant="contained"
						onClick={onLogout}
					>
						התנתק
					</Button>
				</div>
			</div>
		</Popover>
	);

	const [didScroll, setDidScroll] = useState(fixScroll);

	const handleScroll = useCallback(() => {
		if (window.scrollY > 20) {
			setDidScroll(true);
		} else {
			setDidScroll(false);
		}
	}, []);

	useEffect(() => {
		if (!fixScroll) {
			window.addEventListener('scroll', handleScroll);
			return () => {
				window.removeEventListener('scroll', handleScroll);
			};
		}
		
	}, [handleScroll, fixScroll]);

	return (
		<div className="header-container">
			<AppBar
				className={didScroll ? 'appbar-style scrolled-down' : 'appbar-style'}
				position="fixed"
				elevation={didScroll ? elevation : 0}
			>
				<Toolbar>
					<Button size="medium" onClick={onHome}>
						<img className="logo" src={logo} alt="logo" />
					</Button>
					<HeaderCategories />
					<Button size="medium" className="appbar-button" onClick={onContact}>
						צור קשר
					</Button>
					<div className="space" />
					<Search />
					{token
						? <UserProfile onClick={openUserMenu} />
						: (
							<IconButton onClick={redirectToLogin}>
								<FiUser />
							</IconButton>
						)}
					<IconButton onClick={onCart}>
						<Badge badgeContent={itemNum} className="badge" color="error">
							<FiShoppingCart />
						</Badge>
					</IconButton>
				</Toolbar>
			</AppBar>
			{userMenu}
		</div>
	);
};

Header.defaultProps = {
	fixScroll: false,
	elevation: 4,
};

Header.propTypes = {
	fixScroll: PropTypes.bool,
	elevation: PropTypes.number,
};


export default Header;
