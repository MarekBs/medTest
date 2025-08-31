import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { FiLogIn } from "react-icons/fi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/test", { replace: true });
      } else {
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const validateInputs = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email.trim()) {
      setEmailError("Email je povinný.");
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Neplatný formát emailu.");
      valid = false;
    }

    if (!password) {
      setPasswordError("Heslo je povinné.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Heslo musí mať aspoň 6 znakov.");
      valid = false;
    }

    return valid;
  };

  const handleLogIn = async (e) => {
    e.preventDefault();
    setMsg(""); // Clear previous messages
    if (!validateInputs()) {
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setMsg("Prihlásenie bolo úspešné.");
      navigate("/test", { replace: true });
    } catch (error) {
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-credential"
      ) {
        setMsg("Neplatné prihlasovacie údaje!");
      } else if (error.code === "auth/too-many-requests") {
        setMsg("Príliš veľa pokusov. Skúste to znova neskôr.");
      } else {
        setMsg("Chyba pri prihlasovaní: " + error.message);
      }
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 pageBG">
      <div>
        <img
          src={`${import.meta.env.BASE_URL}logoMED.svg`}
          alt="logoMED"
          className="logoIMG2"
          height={100}
        />
      </div>
      <div
        className="card shadow-sm w-100 formCard"
        style={{ maxWidth: "400px" }}
      >
        <div className="card-body text-light">
          <h3 className="card-title text-center  mb-4">Prihlásenie</h3>
          {msg && <div className="alert alert-info">{msg}</div>}
          <form onSubmit={handleLogIn} noValidate>
            <div className="mb-3 form-floating ">
              <input
                type="email"
                className={`form-control ${emailError ? "is-invalid" : ""}`}
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder=""
              />
              <label htmlFor="email" className="">
                Email
              </label>
              {emailError && (
                <div className="invalid-feedback">{emailError}</div>
              )}
            </div>
            <div className="mb-3 form-floating">
              <input
                type="password"
                className={`form-control ${passwordError ? "is-invalid" : ""}`}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder=""
              />
              <label htmlFor="password" className="form-label">
                Heslo
              </label>
              {passwordError && (
                <div className="invalid-feedback">{passwordError}</div>
              )}
            </div>
            <button type="submit" className="btn btn-warning-custom w-100 mt-4">
              <FiLogIn /> Prihlásiť sa
            </button>
          </form>
          <div className="mt-3 text-center">
            <small className="text-secondary p-2">
              {" "}
              Chcem sa zaregistrovať:
            </small>
            <Link to="/register" className="link-light">
              Zaregistruj sa!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
