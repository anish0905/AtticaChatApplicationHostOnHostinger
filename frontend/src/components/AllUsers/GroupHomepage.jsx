import React from 'react'
import GroupChat from './GroupChat'

import { useParams } from 'react-router-dom'
import UserSidebar from './UserSidebar'

const GroupHomepage = () => {

    const {apiEndpoint} = useParams()
  return (
    <div className='flex'>
        <UserSidebar/>
        <GroupChat apiEndpoint={apiEndpoint}/>

      
    </div>
  )
}

export default GroupHomepage

