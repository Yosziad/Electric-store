/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, {
	useEffect, useRef,
} from 'react';

import { TextField, InputAdornment } from '@material-ui/core';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';

let autoComplete;

const loadScript = (url, callback) => {
	const script = document.createElement('script');
	script.type = 'text/javascript';

	if (script.readyState) {
		script.onreadystatechange = () => {
			if (script.readyState === 'loaded' || script.readyState === 'complete') {
				script.onreadystatechange = null;
				callback();
			}
		};
	} else {
		script.onload = () => callback();
	}

	script.src = url;
	document.getElementsByTagName('head')[0].appendChild(script);
};

async function handlePlaceSelect(updateQuery) {
	const addressObject = autoComplete.getPlace();
	const query = addressObject.formatted_address;
	updateQuery(query);
}

function handleScriptLoad(updateQuery, autoCompleteRef) {
	autoComplete = new window.google.maps.places.Autocomplete(
		autoCompleteRef.current,
	);
	autoComplete.setFields(['address_components', 'formatted_address']);
	autoComplete.addListener('place_changed', () =>	handlePlaceSelect(updateQuery));
}

function SearchLocationInput({ handleChange, query, setQuery }) {
	const autoCompleteRef = useRef(null);

	useEffect(() => {
		loadScript(
			'https://maps.googleapis.com/maps/api/js?key=AIzaSyCS4VAfn2dAjdlV3SjZgTU4mLSrwd5pd90&libraries=places',
			() => handleScriptLoad(setQuery, autoCompleteRef),
		);
	}, [setQuery]);

	return (
		<div className="search-location-input">
			<TextField
				fullWidth
				inputRef={autoCompleteRef}
				onChange={handleChange}
				value={query}
				label="כתובת למשלוח"
				placeholder=""
				InputProps={{
					startAdornment: (
						<InputAdornment className="text-field" position="start">
							<LocationOnOutlinedIcon />
						</InputAdornment>
					),
				}}
			/>
		</div>
	);
}

export default SearchLocationInput;
