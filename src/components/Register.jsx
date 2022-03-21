import { Cancel, Room } from '@material-ui/icons';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import './register.css';

const Register = ( {setShowRegister} ) => {
	const [success, setSuccess] = useState(false);
	const [failure, setFailure] = useState(false);
	const nameRef = useRef();
	const emailRef = useRef();
	const passwordRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newUser = {
			username : nameRef.current.value,
			email : emailRef.current.value,
			password : passwordRef.current.value,
		}

		try{
			await axios.post('https://pin-travel-backend.herokuapp.com/api/users/register', newUser);
			setSuccess(true);
		} catch (err) {
			setFailure(true);
		}
	}

	return (
		<div className="registerContainer">
			<div className="logo">
				<Room/>
				TravelPin
			</div>

			<form onSubmit={handleSubmit}>
				<input type='text' placeholder='username' ref={nameRef}></input>
				<input type='email' placeholder='email' ref={emailRef}></input>
				<input type='password' placeholder='password' ref={passwordRef}></input>
				<button className='registerBtn'>Register</button>

				{success && <span className="success">Successful! You can Login now</span>}
				
				{failure && <span className="failure">Something went wrong :(</span>}
			</form>

			<Cancel className='registerCancel' onClick={()=>{setShowRegister(false)}} />
		</div>
	)
}

export default Register