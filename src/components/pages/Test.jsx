import Question from '../Question'
import Footer from '../Footer'
import Stats from '../Stats'
import '../../App.css'
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { FiLogOut } from "react-icons/fi";
import { useState } from 'react'
import { FaChartPie } from 'react-icons/fa';

function Test({user}) {

  const navigate = useNavigate();
  const[mode, setMode] = useState(false);

  const handleLogOut = async () => {
    try {
      await signOut(auth);            // odhlásenie
      navigate('/', { replace: true }); // presmeruj na login
    } catch (error) {
      console.error('Chyba pri odhlaseni:', error);
    }
  };

  return (
    
    <div>
      <div className='loginMenu'>
      <h5 className='welcomeMsg pt-1 m-0'>Vitaj {user.displayName}</h5>
      <button type="button" className={`btn ${mode ? "btn-dark" : "btn-light"} d-flex  align-items-center gap-1 ms-2`} onClick={handleLogOut}>
      <FiLogOut size={20} />Odhlásiť sa
      </button>
      <button  data-bs-toggle="modal" data-bs-target="#scrollableModal" className={`btn ${mode ? "btn-dark" : "btn-light"} d-flex  align-items-center gap-1 ms-2`}><FaChartPie  size={25}/></button>
      </div>
      <Stats email={user.email}></Stats>
      <Question mode={mode} user={user} setMode={setMode}></Question>
      <Footer></Footer>
    </div>
  )
}

export default Test