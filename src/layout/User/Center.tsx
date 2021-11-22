import { Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useSignedUser } from '../../hooks/useSigned'

export function Center() {
  const [list, setlist] = useState()

  return (
    <>
      <div>
        <Menu mode="horizontal">
          <Menu.Item key="1">
            <Link to="/usercenter/ifound">found</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/usercenter/ipaticipate">paticipate</Link>
          </Menu.Item>
        </Menu>
        <hr />
        <Outlet />
      </div>
      <div></div>
    </>
  )
}

// {links.map(
//   (cur,index)=>{
//     return (
//       <Menu.Item key={index}>
//       <Link to ='/usercenter'>sadlkfjlsadkj</Link>
//       </Menu.Item>
//     )
//   }
// )}

