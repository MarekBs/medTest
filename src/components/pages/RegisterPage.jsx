import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { FaUserPlus } from "react-icons/fa";
import { getDoc, doc } from "firebase/firestore";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateInputs = () => {
    let valid = true;
    setEmailError("");
    setUserNameError("");
    setPasswordError("");
    setConfirmPasswordError("");

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email.trim()) {
      setEmailError("Email je povinný.");
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Neplatný formát emailu.");
      valid = false;
    }

    if (!userName.trim()) {
      setUserNameError("Meno je povinné.");
      valid = false;
    }

    if (!password) {
      setPasswordError("Heslo je povinné.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Heslo musí mať aspoň 6 znakov.");
      valid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Potvrďte heslo.");
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Heslá sa nezhodujú.");
      valid = false;
    }

    return valid;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMsg(""); // Clear previous messages

    if (!validateInputs()) return;

    try {
      // 👉 Overenie e-mailu v kolekcii whitelistEmails
      const whitelistRef = doc(db, "whitelistEmails", email);
      const whitelistSnap = await getDoc(whitelistRef);

      if (!whitelistSnap.exists()) {
        setMsg("Tento e-mail nie je povolený na registráciu.");
        return;
      }

      // ✅ E-mail je na whitelist, pokračuj v registrácii
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: userName });

      setMsg("Registrácia bola úspešná, môžeš sa prihlásiť !");
      document.getElementById("regForm").style.display = "none";
      setIsButtonVisible(true);
      await signOut(auth);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setMsg("Zadaný email už je registrovaný !");
      } else if (error.code === "auth/invalid-email") {
        setMsg("Neplatný formát emailu.");
      } else if (error.code === "auth/weak-password") {
        setMsg("Heslo je príliš slabé.");
      } else {
        setMsg("Chyba pri registrácii: " + error.message);
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
        className="card shadow-sm w-100 formCard text-light"
        style={{ maxWidth: "400px" }}
      >
        <div className="card-body">
          <h3 className="card-title text-center mb-4 ">Registrácia</h3>
          {msg && <div className="alert alert-info">{msg}</div>}
          <form onSubmit={handleSignUp} id="regForm" noValidate>
            <div className="mb-3 form-floating">
              <input
                type="email"
                className={`form-control ${emailError ? "is-invalid" : ""}`}
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder=""
              />
              <label htmlFor="email" className="form-label">
                Email
              </label>
              {emailError && (
                <div className="invalid-feedback">{emailError}</div>
              )}
            </div>
            <div className="mb-3 form-floating">
              <input
                type="text"
                className={`form-control ${userNameError ? "is-invalid" : ""}`}
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                placeholder=""
              />
              <label htmlFor="userName" className="form-label">
                Meno
              </label>
              {userNameError && (
                <div className="invalid-feedback">{userNameError}</div>
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
            <div className="mb-3 form-floating">
              <input
                type="password"
                className={`form-control ${
                  confirmPasswordError ? "is-invalid" : ""
                }`}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder=""
              />
              <label htmlFor="confirmPassword" className="form-label">
                Zopakuj heslo
              </label>
              {confirmPasswordError && (
                <div className="invalid-feedback">{confirmPasswordError}</div>
              )}
            </div>
            <button type="submit" className="btn btn-warning-custom w-100 mt-4">
              <FaUserPlus /> Registrovať sa
            </button>
          </form>
          <Link to="/" className={`${isButtonVisible ? "d-block" : "d-none"}`}>
            <button className="btn btn-secondary w-100">
              Prejsť na prihlásenie
            </button>
          </Link>
          <div className="mt-3 text-center">
            <small className="p-2 text-secondary">Už mám účet:</small>
            <Link to="/" className="link-light">
              Prihlásiť sa!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
