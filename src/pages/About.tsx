import REACT from '../assets/react.svg'
import VITE from '../assets/vite.svg'
import REDUX from '../assets/redux.svg'
import FIREBASE from '../assets/firebase.svg'
import TAILWIND from '../assets/tailwind.svg'
import TYPESCRIPT from '../assets/typescript.svg'
import GITHUB from '../assets/github.svg'
import LOGO from '../assets/logo.png'
import { Tooltip } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { SlArrowLeft } from 'react-icons/sl'

export default function About() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col gap-8 justify-center items-center p-10">
      <div className="py-3 w-full items-start">
        <Tooltip title="Back" arrow>
          <div>
            <SlArrowLeft
              onClick={() => navigate(-1)}
              className="w-5 h-5 cursor-pointer"
            />
          </div>
        </Tooltip>
      </div>
      <div className="bg-[#2D61A6] rounded-full p-5 w-44 h-44 grid place-items-center shadow-xl">
        <img src={LOGO} alt="logo" width={150} />
      </div>
      <div className="max-w-[300px] text-center flex flex-col gap-3">
        <h1 className="font-bold text-xl">About</h1>
        <p>
          <strong>Chitchat</strong> is a realtime chat web application with the
          convenience and user experience that makes it easy to communicate
          directly.
        </p>
      </div>
      <div className="flex flex-col gap-4 text-center mt-4">
        <h2 className="font-bold text-lg">Tech Stack</h2>
        <div className="flex gap-4">
          <Tooltip title="React" arrow>
            <img
              src={REACT}
              alt="react"
              width={40}
              className="drop-shadow-xl"
            />
          </Tooltip>
          <Tooltip title="Vite" arrow>
            <img src={VITE} alt="vite" width={40} className="drop-shadow-xl" />
          </Tooltip>
          <Tooltip title="Redux" arrow>
            <img
              src={REDUX}
              alt="redux"
              width={40}
              className="drop-shadow-xl"
            />
          </Tooltip>
          <Tooltip title="Firebase" arrow>
            <img
              src={FIREBASE}
              alt="firebase"
              width={40}
              className="drop-shadow-xl"
            />
          </Tooltip>
          <Tooltip title="Tailwind" arrow>
            <img
              src={TAILWIND}
              alt="tailwind"
              width={40}
              className="drop-shadow-xl"
            />
          </Tooltip>
          <Tooltip title="Typescript" arrow>
            <img
              src={TYPESCRIPT}
              alt="typescript"
              width={40}
              className="drop-shadow-xl"
            />
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col gap-4 text-center items-center mt-4">
        <h2 className="font-bold text-lg">Documentation</h2>
        <Tooltip title="Github" arrow>
          <div>
            <Link to="https://github.com/Akbaroke/Chichat">
              <img
                src={GITHUB}
                alt="github"
                width={40}
                className="drop-shadow-xl cursor-pointer"
              />
            </Link>
          </div>
        </Tooltip>
      </div>
    </div>
  )
}
