import React from 'react'
import UserSidebar from '../AllUsers/UserSidebar'
import ScrollingNavbar from '../admin/ScrollingNavbar'
import AllUserGroupChat from './AllUserGroupChat'
import { useParams } from 'react-router-dom'

const GroupChat = () => {
    const {department} = useParams()

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="flex-shrink-0 mt-20 lg:mt-0">
        <UserSidebar />
      </div>
      <div className="flex flex-col lg:flex-1 bg-white ">
        <div className="fixed lg:static w-full z-10">
          <ScrollingNavbar  />

        </div>
        <div className="flex-1 mt-16 lg:mt-20">
          <AllUserGroupChat department={department} />
        </div>
      </div>
    </div>
  )
}

export default GroupChat
