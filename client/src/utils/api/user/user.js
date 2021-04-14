import axios from 'axios';
import get from 'lodash/get';

const signup = async (userName, password, firstName, lastName) => {
	let response;
	try {
		response = await axios.post('/user', {
			userName,
			password,
			firstName,
			lastName,
		});
		return get(response, 'data.foundUser');
	} catch (error) {
		return error;
	}
};

const login = async (userName, password) => {
	let response;
	try {
		response = await axios.post('/user/login', { userName, password });
	} catch (error) {
		return error;
	}
	return get(response, 'data.foundUser');
};

const loginWithThirdPartyApp = async (userId, source) => {
	let response;
	try {
		response = await axios.post('/user/third-party-login', { userId, source });
	} catch (error) {
		return error;
	}
	return get(response, 'data.foundUser');
};

const logout = async () => {
	let response;
	try {
		response = await axios.post('/user/logout');
	} catch (error) {
		return error;
	}
	return response;
};

export default signup;

export { login, loginWithThirdPartyApp, logout };
