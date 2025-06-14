import { getLogout } from '../../api/authUsers'
import { Link } from 'react-router-dom'
import { useUsername } from '../../store/authUsername'
import { useEffect, useState } from 'react'
import { useRecipientId } from '../../store/recipienId'
import { useMyUserId } from '../../store/myUserId'
import { useIsMyAccount } from '../../store/isMyAccount'

type User = {
  _id: string;
  passwordHash: string;
  username: string;
}

export const AccountPage = () => {
  const { setUsername2 } = useUsername();
  const { recipientId } = useRecipientId();
  const { myUserId } = useMyUserId();

  const [user, setUser] = useState<User>({ _id: '', passwordHash: '', username: '' });
  const { isMyAccount } = useIsMyAccount();
  
  useEffect(() => {
    if (isMyAccount) {
      fetch(`http://localhost:3000/account?userId=${myUserId}`)
        .then((res) => res.json())
        .then((user) => setUser(user));
    } else {
      fetch(`http://localhost:3000/account?userId=${recipientId}`)
        .then((res) => res.json())
        .then((user) => setUser(user));
    }
  }, [isMyAccount]);

  return (
    <div>
      <p>{user.username}</p>
      {!isMyAccount &&
      <Link
        to={`/chats/${user._id}`}
        style={{ marginRight: '40px' }}
      >
        Перейти в чат
      </Link>}


      {isMyAccount &&
      <Link
        to={'/'}
        style={{ marginRight: '40px' }}
        onClick={async () => {
          setUsername2('');
          await getLogout();
        }}>
          Выйти из аккаунта
      </Link>}
    </div>
  )
}