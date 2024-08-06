import React from 'react'
import ManagerGroupSms from './ManagerGroupSms'
import ScrollingNavbar from '../admin/ScrollingNavbar'
import ManagerSidebar from './ManagerSidebar'

const ManagerGroupChat = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="flex-shrink-0 mt-20 lg:mt-0">
        <ManagerSidebar />
      </div>
      <div className="flex flex-col lg:flex-1 bg-white ">
        <div className="fixed lg:static w-full z-10">
          <ScrollingNavbar />
        </div>
        <div className="flex-1 mt-16 lg:mt-20">
          <ManagerGroupSms department="Manager" />
        </div>
      </div>
    </div>
  )
}

export default ManagerGroupChat

