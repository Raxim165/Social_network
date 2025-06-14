import './chats.css'
import { useGetUsers } from '../../api/users';
import { Link, Routes, Route, BrowserRouter, Outlet } from 'react-router-dom';
import { useRecipientId } from '../../store/recipienId';
import { useRecipientName } from '../../store/recipientName';
import { useEffect } from 'react';
import { useMyUserId } from '../../store/myUserId';

export const Chats = () => {
  const { users, loading, error } = useGetUsers();
  const { setRecipientId } = useRecipientId();
  const { setRecipientName } = useRecipientName();

  return (
    <div className='chats'>
      <ul className='chats-list'>
        {users.map(user => (
          <li key={user._id}>
            <Link
              to={`/chats/${user._id}`}
              onClick={() => {
                setRecipientId(user._id);
                setRecipientName(user.username);
              }}
              className='chat-link'
            >
              {user.username}
            </Link>
          </li>
        ))}
      </ul>
      <section style={{ width: '100%' }}>
        <Outlet />
      </section>
    </div>
  )
}