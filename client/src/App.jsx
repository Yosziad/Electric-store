import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {
	BrowserRouter, Switch, Route, Redirect,
} from 'react-router-dom';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset, ThemeProvider } from '@material-ui/core/styles';
import doesCookieExist from './utils/doesCookieExist';
import CustomTheme from './assests/CustomTheme';
import configureStore from './store/configureStore';

// importing pages
import Signup from './components/pages/Signup/Signup';
import Login from './components/pages/Login/Login';
import Home from './components/pages/Home/Home';
import Categories from './components/pages/Categories/Categories';
import Contact from './components/pages/Contact/Contact';
import Product from './components/pages/Product/Product';
import Cart from './components/pages/Cart/Cart';
import Orders from './components/pages/Orders/Orders';

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

// Configure store
const { store, persistor } = configureStore();

const App = () => {
	const [token, setToken] = useState(false);
	useEffect(() => {
		if (doesCookieExist('token')) {
			setToken(true);
		} else {
			setToken(false);
		}
	}, []);
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ThemeProvider theme={CustomTheme}>
					<StylesProvider jss={jss}>
						<BrowserRouter>
							<Switch>
								<Route exact path="/">
									<Home />
								</Route>
								<Route exact path="/login">
									<Login />
								</Route>
								<Route exact path="/signup">
									<Signup />
								</Route>
								<Route path="/categories/:category">
									<Categories />
								</Route>
								<Route exact path="/contact">
									<Contact />
								</Route>
								<Route exact path="/products/:productId">
									<Product />
								</Route>
								<Route exact path="/cart">
									{token
										? <Cart />
										: <Redirect to="/login" />}
								</Route>
								<Route exact path="/orders">
									{token
										? <Orders />
										: <Redirect to="/login" />}
								</Route>
							</Switch>
						</BrowserRouter>
					</StylesProvider>
				</ThemeProvider>
			</PersistGate>
		</Provider>
	);
};

export default App;
