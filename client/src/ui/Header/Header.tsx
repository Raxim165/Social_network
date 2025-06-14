import './header.css'
import { useModal } from '../../store/authModal';
import { AuthForm } from '../AuthForm/AuthForm';
import { Link } from 'react-router-dom';
import { useUsername } from '../../store/authUsername';
import { useMyUserId } from '../../store/myUserId';
import { useIsMyAccount } from '../../store/isMyAccount';

export const Header = () => {
  const toggleModal = useModal(state => state.toggleModal);
  const isOpenModal = useModal(state => state.isModalOpen);

  const { username } = useUsername();
  const { myUserId } = useMyUserId();

  const { isMyAccount, setIsmyAccount } = useIsMyAccount();

  function handleClick() {
    toggleModal();
  }

  return (
    <>
     {isOpenModal && <AuthForm />}
     <header className="header">
       <Link
         to={'/'}
         className='button-auth'
       >
        Главная
      </Link>
       
       <Link
         {...username ? { to: `/account/${myUserId}` } : { to: '' }}
         className="button-auth"
         onClick={() => {
           if (!username) handleClick()
           else setIsmyAccount(true)
           }
         }
       >
         {username ? username : 'Войти'}
       </Link>

       <Link
         to={'/chats'}
       >
        Чаты
       </Link>
     </header>
    </>
  )
}
