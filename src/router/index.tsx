import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import * as Middleware from '../middlewares'
import RoomChat from '../pages/RoomChat'

export default function root() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <Middleware.Auth>
            <Home />
          </Middleware.Auth>
        }
      />
      <Route
        path="/:name"
        element={
          <Middleware.Auth>
            <RoomChat />
          </Middleware.Auth>
        }
      />
    </Routes>
  )
}
