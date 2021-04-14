import React from 'react';
import Header from '../../partials/Header/Header';
import ItemBanner from '../../partials/ItemBanner/ItemBanner';
import MostViewedItems from '../../common/MostViewedItems/MostViewedItems';
import './Home.scss';

const Home = () => (
	<div className="home-container">
		<Header />
		<ItemBanner />
		<MostViewedItems title="המוצרים החמים" />
	</div>
);

export default Home;
