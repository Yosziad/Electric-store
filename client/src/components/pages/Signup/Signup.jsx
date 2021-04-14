import React, { useState, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import PersonIcon from '@material-ui/icons/Person';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import Button from '@material-ui/core/Button';
import signup from '../../../utils/api/user/user';
import './Signup.scss';

const Signup = () => {
	const [username, setUsername] = useState('');
	const [usernameError, setUsernameError] = useState('');
	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [passwordAgain, setPasswordAgain] = useState('');
	const [passwordAgainError, setPasswordAgainError] = useState('');
	const [firstname, setFirstname] = useState('');
	const [firstnameError, setFirstnameError] = useState('');
	const [lastname, setLastname] = useState('');
	const [lastnameError, setLastnameError] = useState('');

	const history = useHistory();

	const onUsernameChange = useCallback((e) => {
		setUsername(e.target.value);
	}, []);
	const onPasswordChange = useCallback((e) => setPassword(e.target.value), []);
	const onPasswordChangeAgain = useCallback(
		(e) => setPasswordAgain(e.target.value),
		[],
	);
	const onFirstnameChange = useCallback(
		(e) => setFirstname(e.target.value),
		[],
	);
	const onLastnameChange = useCallback((e) => setLastname(e.target.value), []);

	const validate = useCallback(() => {
		let isError = false;
		const userNameValidationRegEx = /^([a-z]|[0-9]|-|_)+$/;
		const isUserNameValid = userNameValidationRegEx.test(username);
		if (!isUserNameValid) {
			setUsernameError(
				'שם המשתמש יכול להכיל אך ורק אותיות קטנות באנגלית, מספרים,- או _',
			);
			isError = true;
			return isError;
		}
		setUsernameError('');
		if (!password) {
			setPasswordError('שדה הסיסמא ריק! עליך למלא את כל השדות');
			isError = true;
			return isError;
		}
		setPasswordError('');
		if (password.length < 8) {
			setPasswordError('אורך הסיסמא חייב להיות יותר מ-8 תווים');
			isError = true;
			return isError;
		}
		setPasswordError('');
		if (passwordAgain !== password) {
			setPasswordAgainError('הסיסמא הראשונה והשניה אינן תואמות');
			isError = true;
			return isError;
		}
		setPasswordAgainError('');
		if (!firstname) {
			setFirstnameError('שדה שם הפרטי ריק! עליך למלא את כל השדות');
			isError = true;
			return isError;
		}
		setFirstnameError('');
		if (!lastname) {
			setLastnameError('שדה שם המשפחה ריק! עליך למלא את כל השדות');
			isError = true;
			return isError;
		}
		setLastnameError('');
		return isError;
	}, [firstname, lastname, password, passwordAgain, username]);

	const onSubmit = useCallback(() => {
		const err = validate();
		if (!err) {
			signup(username, password, firstname, lastname);
			history.push('/');
		}
	}, [firstname, history, lastname, password, username, validate]);

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
				<Grid item className="signup-container">
					<Grid item xs={12} className="signup-title">
						<h1>בוא נתחיל!</h1>
					</Grid>
					<Grid item xs={12} className="signup-form">
						<TextField
							id="input-with-icon-textfield"
							label="שם משתמש"
							value={username}
							onChange={onUsernameChange}
							className="text-field"
							error={usernameError.length > 0}
							helperText={usernameError.length > 0 ? usernameError : ' '}
							InputProps={{
								startAdornment: (
									<InputAdornment className="text-field" position="start">
										<PersonIcon />
									</InputAdornment>
								),
							}}
						/>
					</Grid>
					<Grid item xs={12} className="small-text">
						<TextField
							id="input-with-icon-textfield"
							label="סיסמא"
							type="password"
							value={password}
							onChange={onPasswordChange}
							className="text-field"
							error={passwordError.length > 0}
							helperText={passwordError.length > 0 ? passwordError : ' '}
							InputProps={{
								startAdornment: (
									<InputAdornment className="text-field" position="start">
										<LockOpenIcon />
									</InputAdornment>
								),
							}}
						/>
					</Grid>
					<Grid item xs={12} className="small-text">
						<TextField
							id="input-with-icon-textfield"
							label="אשר סיסמא"
							type="password"
							value={passwordAgain}
							onChange={onPasswordChangeAgain}
							className="text-field"
							error={passwordAgainError.length > 0}
							helperText={
								passwordAgainError.length > 0 ? passwordAgainError : ' '
							}
							InputProps={{
								startAdornment: (
									<InputAdornment className="text-field" position="start">
										<LockOpenIcon />
									</InputAdornment>
								),
							}}
						/>
					</Grid>
					<Grid item xs={12} className="small-text">
						<TextField
							id="input-with-icon-textfield"
							label="שם פרטי"
							value={firstname}
							onChange={onFirstnameChange}
							className="text-field"
							error={firstnameError.length > 0}
							helperText={firstnameError.length > 0 ? firstnameError : ' '}
							InputProps={{
								startAdornment: (
									<InputAdornment className="text-field" position="start">
										<PersonIcon />
									</InputAdornment>
								),
							}}
						/>
					</Grid>
					<Grid item xs={12} className="small-text">
						<TextField
							id="input-with-icon-textfield"
							label="שם משפחה"
							value={lastname}
							onChange={onLastnameChange}
							className="text-field"
							error={lastnameError.length > 0}
							helperText={lastnameError.length > 0 ? lastnameError : ' '}
							InputProps={{
								startAdornment: (
									<InputAdornment className="text-field" position="start">
										<PersonIcon />
									</InputAdornment>
								),
							}}
						/>
					</Grid>
					<Grid item xs={12} className="signup-form">
						<Button variant="contained" type="submit" onClick={onSubmit}>
							הרשם
						</Button>
					</Grid>

					<Grid item xs={12} className="signup-link">
						<h5>
							יש לך כבר משתמש
							?
							<Link to="login">התחבר כאן</Link>
						</h5>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
};

export default Signup;
