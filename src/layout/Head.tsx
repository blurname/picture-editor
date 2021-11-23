import { Dropdown, Menu } from 'antd'
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSigned } from '../hooks/useSigned'

export function Head() {
  const { user, signout } = useSigned()
  const navigate = useNavigate()
  const backHome = () => {
    navigate(`/boxes/${user.id}`)
  }
  return (
    <Menu mode='horizontal' className="bg-green-300">
      {user !== undefined && user.id !== undefined && (
        <Menu.Item key="1">
          <button className="bg-purple-300" onClick={backHome}>
            <h1>home</h1>
          </button>
        </Menu.Item>
      )}
      <Menu.Item key="2" className="left-100">
        <Dropdown
          className="w-30 bg-orange-300"
          overlay={
            <Menu>
              <Menu.Item key="1">
                <NavLink to={'/signin'}>signin</NavLink>
              </Menu.Item>
              <Menu.Item key="2">
                <NavLink to={'/signup'}>signup</NavLink>
              </Menu.Item>
              <Menu.Item key="3">
                <NavLink to={'/usercenter'}>userCenter</NavLink>
              </Menu.Item>
              <Menu.Item key="4">
                <button onClick={signout}>signout</button>
              </Menu.Item>
            </Menu>
          }
        >
          <div>
            {user !== undefined && user.id !== undefined && (
              <h1>{user.name}</h1>
            )}
          </div>
        </Dropdown>
      </Menu.Item>
    </Menu>
  )
}
