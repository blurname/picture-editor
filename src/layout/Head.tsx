import { Dropdown,Menu } from 'antd'
import React from 'react'
import { NavLink,useNavigate } from 'react-router-dom'
export function Head(){
  const navigate = useNavigate()
  return(
       <div>
         <Dropdown overlay={
            <Menu>
              <Menu.Item key='1'>
              <NavLink to={'/signin'}>signin</NavLink>
              </Menu.Item>
              <Menu.Item key='2'>
              <NavLink to={'/signup'}>signup</NavLink>
              </Menu.Item>
            </Menu>
          }>
          <h1>head</h1>
          </Dropdown> 
       </div>
  )
}
