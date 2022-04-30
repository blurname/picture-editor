import { Menu } from 'antd'
import React, { useEffect, useState, useContext } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { userContext } from '../../context'

export function Center() {
  const [list, setlist] = useState()
  const { userId } = useContext(userContext)

  return (
    <>
      <div>
        <Menu mode="horizontal">
          <Menu.Item key="1">
            <Link to={'/usercenter/boxes/' + userId}>found</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to={'/usercenter/ipaticipate/' + userId}>paticipate</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to={'/signin/a'}>a</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to={'/signin/b'}>b</Link>
          </Menu.Item>
          {/* <Menu.Item key="5">
            <Link to={'/usercenter/Invite/b'}>invite</Link>
          </Menu.Item> */}
        </Menu>
        <hr />
        <Outlet />
      </div>
    </>
  )
}
