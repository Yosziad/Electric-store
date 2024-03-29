function doesHttpOnlyCookieExist(cookiename) {
	const d = new Date();
	d.setTime(d.getTime() + (1000));
	const expires = `expires=${d.toUTCString()}`;

	document.cookie = `${cookiename}=new_value;path=/;${expires}`;
	if (document.cookie.indexOf(`${cookiename}=`) === -1) {
		return true;
	}
	return false;
}

export default doesHttpOnlyCookieExist;
