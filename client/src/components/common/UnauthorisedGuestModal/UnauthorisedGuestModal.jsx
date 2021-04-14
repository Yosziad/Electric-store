import React, {
	useState,
	useCallback,
	useMemo,
} from 'react';
import { useHistory, Link } from 'react-router-dom';
import {
	Typography,
	Popover,
	Fade,
	IconButton,
	Grid,
	Button,
} from '@material-ui/core';
import { AiOutlineClose } from 'react-icons/ai';

const loginImg = '/img/logo.png';

const Unauthorisedguestmodal = () => {
	const [isSigned, setIsSigned] = useState(false);

	const history = useHistory();

	const handleClose = () => {
		setIsSigned(false);
	};

	const onHome = useCallback(() => {
		history.push('/');
	}, [history]);

	const onLogin = useCallback(() => {
		history.push('/login');
	}, [history]);

	const open = isSigned;
	const id = useMemo(() => (isSigned ? 'simple-popover' : undefined), [isSigned]);

	return (
		<Popover
			id={id}
			className="product-popover"
			open={open}
			anchorEl={isSigned}
			onClose={handleClose}
			anchorReference="anchorPosition"
			anchorPosition={{ top: 200, left: 700 }}
		>
			<Fade in={open}>
				<Grid item className="popover-container">
					<IconButton
						onClick={handleClose}
						className="close-btn"
					>
						<AiOutlineClose />
					</IconButton>
					<Button onClick={onHome} className="home-btn">
						<img className="image-logo" src={loginImg} alt="login" />
					</Button>
					<Typography variant="h5" className="text">
						עליך להתחבר לאתר על מנת לבצע הזמנה
					</Typography>
					<Button
						size="small"
						className="login-btn"
						variant="contained"
						onClick={onLogin}
					>
						התחבר
					</Button>
					<h5>
						אין לך משתמש
						?
						<Link to="../signup">הרשם כאן</Link>
					</h5>
				</Grid>
			</Fade>
		</Popover>
	);
};

export default Unauthorisedguestmodal;
