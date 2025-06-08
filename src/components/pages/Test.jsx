import Question from '../Question'
import Footer from '../Footer'
import '../../App.css'
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

function Test({user}) {

  const navigate = useNavigate();

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
      <button type="button" className='btn btn-dark' onClick={handleLogOut}>
        Odhlásiť sa
      </button>
      </div>
      
      <Question></Question>
      <Footer></Footer>
    </div>
  )
}

export default Test