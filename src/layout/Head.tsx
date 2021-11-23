import { Dropdown, Menu } from 'antd'
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSigned } from '../hooks/useSigned'

export function Head() {
  const { user, signout } = useSigned()
  return (
    <Dropdown
      className="w-30 ml-300 bg-orange-300"
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
        {user && <h1>{user.name}</h1>}
        {!user && <h1>not rendered</h1>}
      </div>
    </Dropdown>
  )
}
