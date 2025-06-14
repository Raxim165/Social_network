import { useGetUsers } from '../../api/users';
import { Link } from 'react-router-dom';
import { useRecipientId } from '../../store/recipienId';
import { useRecipientName } from '../../store/recipientName';
import { useIsMyAccount } from '../../store/isMyAccount';

export const MainPage = () => {
  const { users, loading, error } = useGetUsers();
  const { setRecipientId } = useRecipientId();
  const { setRecipientName } = useRecipientName();
  const { setIsmyAccount } = useIsMyAccount();

  return (
    <div>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            <Link
              to={`/account/${user._id}`}
              onClick={() => {
                setRecipientId(user._id);
                setRecipientName(user.username);
                setIsmyAccount(false);
              }}
            >
              {user.username}
            </Link>
          </li>))}
      </ul>
    </div>
  )
}