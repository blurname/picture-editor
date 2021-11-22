import { Dropdown,Menu } from 'antd'
import React from 'react'
import { NavLink,useNavigate } from 'react-router-dom'
export function Head(){
  const navigate = useNavigate()
  return(
         <Dropdown className="w-30 ml-300" overlay={
            <Menu>
              <Menu.Item key='1'>
              <NavLink to={'/signin'}>signin</NavLink>
              </Menu.Item>
              <Menu.Item key='2'>
              <NavLink to={'/signup'}>signup</NavLink>
              </Menu.Item>
              <Menu.Item key='3'>
              <NavLink to={'/usercenter'}>userCenter</NavLink>
              </Menu.Item>
            </Menu>
          }>
          <h1>Avatar</h1>
          </Dropdown> 
  )
}
