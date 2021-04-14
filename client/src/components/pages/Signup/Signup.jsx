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

const userNameValidationRegEx = /^([a-z]|[0-9]|-|_)+$/;

const Signup = () => {
	const [username, setUsername] = useState('');
	const [usernameError, setUsernameError] = useState('');
	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [passwordConfirmError, setPasswordConfirmError] = useState('');
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
		(e) => setPasswordConfirm(e.target.value),
		[],
	);
	const onFirstnameChange = useCallback(
		(e) => setFirstname(e.target.value),
		[],
	);
	const onLastnameChange = useCallback((e) => setLastname(e.target.value), []);

	const validate = useCallback(() => {
		let isValid = true;
		const isUserNameValid = userNameValidationRegEx.test(username);
		if (!isUserNameValid) {
			setUsernameError(
				'שם המשתמש יכול להכיל אך ורק אותיות קטנות באנגלית, מספרים,- או _',
			);
			isValid = false;
		} else {
			setUsernameError('');
		}
		if (!password) {
			setPasswordError('שדה הסיסמא ריק! עליך למלא את כל השדות');
			isValid = false;
		} else {
			setPasswordError('');
		}
		if (password.length < 8) {
			setPasswordError('אורך הסיסמא חייב להיות יותר מ-8 תווים');
			isValid = false;
		} else {
			setPasswordError('');
		}
		if (passwordConfirm !== password) {
			setPasswordConfirmError('הסיסמא הראשונה והשניה אינן תואמות');
			isValid = false;
		} else {
			setPasswordConfirmError('');
		}
		if (!firstname) {
			setFirstnameError('שדה שם הפרטי ריק! עליך למלא את כל השדות');
			isValid = false;
		} else {
			setFirstnameError('');
		}
		if (!lastname) {
			setLastnameError('שדה שם המשפחה ריק! עליך למלא את כל השדות');
			isValid = false;
		} else {
			setLastnameError('');
		}
		return isValid;
	}, [firstname, lastname, password, passwordConfirm, username]);

	const onSubmit = useCallback(() => {
		const isValid = validate();
		if (isValid) {
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
							value={passwordConfirm}
							onChange={onPasswordChangeAgain}
							className="text-field"
							error={passwordConfirmError.length > 0}
							helperText={
								passwordConfirmError.length > 0 ? passwordConfirmError : ' '
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
