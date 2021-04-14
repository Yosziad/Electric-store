import React from 'react';
import { Typography, Paper } from '@material-ui/core';
import { FaPhone } from 'react-icons/fa';
import { GrMail } from 'react-icons/gr';
import Header from '../../partials/Header/Header';
import './Contact.scss';

const Contact = () => (
	<>
		<Header />
		<div className="contact-page">
			<Typography variant="h2" className="title">צור קשר</Typography>
			<Typography variant="subtitle1" className="text">רוצה ליצור איתנו קשר? נשמח לשמוע ממך. כך תוכל לעשות זאת...</Typography>
			<div className="cards-container">
				<Paper variant="outlined" className="card" elevation={3} square>
					<FaPhone className="icon" />
					<Typography variant="h5" className="card-text">צור קשר דרך הנייד</Typography>
					<Typography variant="subtitle1" className="card-text">מעוניין לשמוע עוד פרטים. התקשר למספר:</Typography>
					<Typography variant="subtitle1" className="card-text">05x-xxxxxxx</Typography>
				</Paper>
				<Paper variant="outlined" className="card" elevation={3} square>
					<GrMail className="icon" />
					<Typography variant="h5" className="card-text">צור קשר דרך הדואר האלקטרוני</Typography>
					<Typography variant="subtitle1" className="card-text">
						מעוניין לשמוע עוד פרטים במייל.
						<br />
						שלח דואר לכתובת :
					</Typography>
					<Typography variant="subtitle1" className="card-text">xxxx@gmail.com</Typography>
				</Paper>
			</div>
		</div>
	</>
);

export default Contact;
