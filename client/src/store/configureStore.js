import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers';

const persistConfig = {
	key: 'root',
	storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const configureStore = () => {
	const store = createStore(persistedReducer, compose(applyMiddleware(thunk)));
	const persistor = persistStore(store);
	return {
		store,
		persistor,
	};
};

export default configureStore;
