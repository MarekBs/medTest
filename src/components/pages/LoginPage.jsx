import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        navigate('/test', { replace: true });
      }
    });
    return unsubscribe;
  }, [navigate]);

  const validateInputs = () => {
    let valid = true;
    // reset errors
    setEmailError('');
    setPasswordError('');

    // email validation
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email.trim()) {
      setEmailError('Email je povinný.');
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Neplatný formát emailu.');
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

    return valid;
  };

  const handleLogIn = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMsg('Prihlásenie bolo úspešné.');
      navigate('/test', { replace: true });
    } catch (error) {
      setMsg("Neplatné prihlasovacie údaje!");
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="card shadow-sm w-100" style={{ maxWidth: '400px' }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Prihlásenie</h3>
          {msg && <div className="alert alert-info">{msg}</div>}
          <form onSubmit={handleLogIn} noValidate>
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
            <button type="submit" className="btn btn-primary w-100" disabled={!!emailError || !!passwordError}>
              Prihlásiť sa
            </button>
          </form>
          <div className="mt-3 text-center">
            <small className='text-secondary p-2'>Chcem sa zaregistrovať:</small>
            <Link to="/register" className="link-primary">Zaregistruj sa!</Link>
          </div>
        </div>
      </div>
    </div>
  );
}


