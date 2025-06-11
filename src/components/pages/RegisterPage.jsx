import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';
import { FaUserPlus } from "react-icons/fa";

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');


  const validateInputs = () => {
    let valid = true;
    // reset errors
    setEmailError('');
    setUserNameError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // email validation
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email.trim()) {
      setEmailError('Email je povinný.');
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Neplatný formát emailu.');
      valid = false;
    }

    // username validation
    if (!userName.trim()) {
      setUserNameError('Meno je povinné.');
      valid = false;
    }

    // password validation
    if (!password) {
      setPasswordError('Heslo je povinné.');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Heslo musí mať aspoň 6 znakov.');
      valid = false;
    }

    // confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Potvrďte heslo.');
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Heslá sa nezhodujú.');
      valid = false;
    }

    return valid;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: userName });
      setMsg('Registrácia bola úspešná, môžeš sa prihlásiť !');
      document.getElementById('regForm').style.display = 'none';
      setIsButtonVisible(true);
      await signOut(auth);
    } catch (error) {
      setMsg("Zadaný email už je registrovaný !");
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 pageBG">
      <div><img src={`${import.meta.env.BASE_URL}logoMED.svg`} alt="logoMED" className="logoIMG2" height={100}/></div>
      <div className="card shadow-sm w-100 formCard text-light" style={{ maxWidth: '400px' }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4 fw-bold">Registrácia</h3>
          {msg && <div className="alert alert-info">{msg}</div>}
          <form onSubmit={handleSignUp} id="regForm" noValidate>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${emailError ? 'is-invalid' : ''}`}
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateInputs}
                required
              />
              {emailError && <div className="invalid-feedback">{emailError}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="userName" className="form-label">Meno</label>
              <input
                type="text"
                className={`form-control ${userNameError ? 'is-invalid' : ''}`}
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onBlur={validateInputs}
                required
              />
              {userNameError && <div className="invalid-feedback">{userNameError}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Heslo</label>
              <input
                type="password"
                className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validateInputs}
                required
              />
              {passwordError && <div className="invalid-feedback">{passwordError}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Zopakuj heslo</label>
              <input
                type="password"
                className={`form-control ${confirmPasswordError ? 'is-invalid' : ''}`}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={validateInputs}
                required
              />
              {confirmPasswordError && <div className="invalid-feedback">{confirmPasswordError}</div>}
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={
                !!emailError || !!userNameError || !!passwordError || !!confirmPasswordError
              }
            >
              <FaUserPlus /> Registrovať sa
            </button>
            
          </form>
          <Link to="/" className={`${isButtonVisible ? "d-block" : "d-none"}`}>
          <button className="btn btn-secondary w-100">Prejsť na prihlásenie</button> 
          </Link>
          <div className="mt-3 text-center">
            <small className='p-2 text-secondary'>Už mám účet:</small>
            <Link to="/" className="link-primary">Prihlásiť sa!</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

