import axios from "axios";
import { useEffect, useState } from "react";
import { useUsername } from "../store/authUsername";
import { useMyUserId } from "../store/myUserId";

type User = {
  _id: string;
  username: string;
  passwordHash: string;
}

const getUsers = async (myUserId: string): Promise<User[]> =>
  axios.get(`http://localhost:3000/users/?myUserId=${myUserId}`).then(({data}) => data);

export function useGetUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { myUserId } = useMyUserId();

  useEffect(() => {
    if (!myUserId) return;
    getUsers(myUserId)
    .then(data => {
      setUsers(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError("Ошибка загрузки пользователей");
      setLoading(false);
    })
  }, []);

  return { users, loading, error };
}
