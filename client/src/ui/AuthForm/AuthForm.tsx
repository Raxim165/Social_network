import './authForm.css'
import { useState } from 'react'
import { useModal } from '../../store/authModal';
import { postLogin, postSignUp } from '../../api/authUsers';
import { useMyUserId } from '../../store/myUserId';
import { useUsername } from '../../store/authUsername';

export const AuthForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isLogin, setIsLogin] = useState(true);
    const toggleModal = useModal(state => state.toggleModal);
    const { setMyUserId } = useMyUserId();
    const { setUsername2 } = useUsername();

    const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (isLogin) {
        try {
          const response = await postLogin(username, password);
          setMyUserId(response.data.id);
          setUsername2(response.data.username);
          toggleModal();
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          await postSignUp(username, password);
        } catch (error) {
          console.log(error);
        }
      }
    }
// background-color: rgba(0, 0, 0, 0.7);
  return (
    <div className='auth-modal'>
      <div className='auth-wrapper'>
        <button onClick={toggleModal}>Закрыть</button>
        <form
          className="auth-form"
          onSubmit={onSubmit}
        >
          <input
            className='input-auth'
            required
            type="text"
            placeholder="Имя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className='input-auth'
            required
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className='button-auth'
            type="submit"
          >
            {isLogin ? "Войти" : "Создать аккаунт"}
          </button>
        </form>

        <button
          className='button-toggle-auth'
          onClick={() => isLogin ? setIsLogin(false) : setIsLogin(true)}
        >
          {isLogin ? "Регистрация" : "У меня уже есть аккаунт"}
        </button>
      </div>
    </div>
  );
};
