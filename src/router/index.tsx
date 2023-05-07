import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import * as Middleware from '../middlewares'
import RoomChat from '../pages/RoomChat'
import About from '../pages/About'

export default function root() {
  return (
    <Routes>
      <Route index path="/login" element={<Login />} />
      <Route path="/about" element={<About />} />
      <Route
        path="/"
        element={
          <Middleware.Auth>
            <Home />
          </Middleware.Auth>
        }
      />
      <Route
        path="/chat"
        element={
          <Middleware.Auth>
            <RoomChat />
          </Middleware.Auth>
        }
      />
    </Routes>
  )
}
