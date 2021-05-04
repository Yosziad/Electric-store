import React, { useState, useCallback	} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from 'react-google-login';
import {
	CssBaseline, Grid, TextField, InputAdornment, Button,
} from '@material-ui/core';
import { Person, LockOpen } from '@material-ui/icons';
import { FaGoogle } from 'react-icons/fa';
import currentUserAction from '../../../store/actions/currentUserAction';
import doesCookieExist from '../../../utils/doesCookieExist';
import { loginWithThirdPartyApp, login } from '../../../utils/api/user/user';
import './Login.scss';

const loginImg = '/img/logo.png';

const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const dispatch = useDispatch();

	const onUsernameChange = useCallback((e) => {
		setUsername(e.target.value);
	}, []);
	const onPasswordChange = useCallback((e) => setPassword(e.target.value), []);

	const history = useHistory();

	const loginWithThirdParty =	useCallback(async (userId, userDetails, source) => {
		const user = await loginWithThirdPartyApp(userId, source);
		dispatch(currentUserAction({
			...userDetails,
			source: user.source,
			sourceId: user.sourceId,
			role: user.role,
		}));
		const token = doesCookieExist('token');
		if (token) {
			history.push('/');
		} else {
			setError('התחברות נכשלה');
		}
	}, [dispatch, history]);

	const responseGoogle = useCallback((response) => {
		if (response.accessToken) {
			const googleProfile = response.profileObj;
			const userDetails = {
				firstName: googleProfile.givenName,
				lastName: googleProfile.familyName,
				imageUrl: googleProfile.imageUrl,
			};
			loginWithThirdParty(response.googleId, userDetails, 'Google');
		}
	}, [loginWithThirdParty]);

	const onSubmit = useCallback(async () => {
		setError('');
		const currentUser = await login(username, password);
		dispatch(currentUserAction(currentUser));
		const token = doesCookieExist('token');
		if (token) {
			history.goBack();
		} else {
			setError('שם משתמש או סיסמא שגויים');
		}
	}, [dispatch, history, password, username]);

	return (
		<>
			<CssBaseline />
			<Grid
				container
				direction="column"
				justify="center"
				alignItems="center"
				spacing={3}
				className="page-container"
			>
				<Grid item className="login-container">
					<div>
						<Grid item className="image-container" xs={12}>
						<Link to="/">
							<img className="image-logo" src={loginImg} alt="login" />
						</Link>
					</Grid>
					<Grid item xs={12} className="login-title">
						<h1>ברוכים הבאים!</h1>
					</Grid>
					<Grid item xs={12} className="login-form">
						<TextField
							id="input-with-icon-textfield"
							label="שם משתמש"
							className="text-field"
							value={username}
							onChange={onUsernameChange}
							InputProps={{
								startAdornment: (
									<InputAdornment className="text-field" position="start">
										<Person />
									</InputAdornment>
								),
							}}
						/>
					</Grid>
					<Grid item xs={12} className="login-form">
						<TextField
							label="סיסמא"
							className="text-field"
							type="password"
							value={password}
							onChange={onPasswordChange}
							error={error.length > 0}
							helperText={error.length > 0 ? error : ' '}
							InputProps={{
								startAdornment: (
									<InputAdornment className="text-field" position="start">
										<LockOpen />
									</InputAdornment>
								),
							}}
						/>
					</Grid>
					<Grid item xs={12} className="small-link" />
					<Grid item xs={12} className="login-form">
						<Button
							className="submit-button"
							variant="contained"
							type="submit"
							onClick={onSubmit}
						>
							התחבר
						</Button>
					</Grid>
					<Grid item xs={12} className="small-text">
						<h5>או התחבר באמצעות</h5>
					</Grid>
					<Grid container spacing={3} className="button-container">
						<Grid item xs={6} className="left-button">
							<GoogleLogin
								clientId={process.env.REACT_APP_GOOGLE_API_KEY}
								render={(renderProps) => (
									<Button
										variant="contained"
										startIcon={<FaGoogle />}
										onClick={renderProps.onClick}
										disabled={renderProps.disabled}
									>
										גוגל
									</Button>
								)}
								buttonText="Login"
								onSuccess={responseGoogle}
								onFailure={responseGoogle}
								cookiePolicy="single_host_origin"
							/>
						</Grid>
					</Grid>
					<Grid item xs={12} className="signup-link">
						<h5>
							אין לך משתמש
							?
							<Link to="signup">הרשם כאן</Link>
						</h5>
					</Grid>
					</div>
					
				</Grid>
			</Grid>
		</>
	);
};

export default Login;
