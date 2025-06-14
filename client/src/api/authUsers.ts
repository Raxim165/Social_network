import axios from "axios";

export async function postSignUp(username: string, password: string): Promise<void> {
  return axios.post("http://localhost:3000/signup", { username, password });
}

export async function postLogin(username: string, password: string) {
  return axios.post("http://localhost:3000/login", { username, password }, { withCredentials: true });
}

export async function getLogout() {
  return axios.get("http://localhost:3000/logout", { withCredentials: true });
}