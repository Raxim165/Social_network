import { Header } from './ui/Header/Header'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AccountPage } from './pages/Account/Account'
import { MainPage } from './pages/Main/Main'
import { Chats } from './pages/Chats/Chats'
import { Chat } from './ui/Chat/Chat'

function App() {

  return (
    <BrowserRouter>
      <div className='container'>
        <Header />
        <main>
          <Routes>
            <Route path='/' element={<MainPage />} />
            <Route path='/account/:_id' element={<AccountPage />} />
            <Route path='/chats' element={<Chats />}>
              <Route path=':_id' element={<Chat />} />
            </Route>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
