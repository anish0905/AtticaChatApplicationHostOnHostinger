import React from 'react'
import ScrollingNavbar from '../admin/ScrollingNavbar'
import BillingSidebar from './BillingSidebar'
import BillingGroupChat from './BillingGroupChat'

const BillingGroupHome = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="flex-shrink-0 mt-20 lg:mt-0">
        <BillingSidebar />
      </div>
      <div className="flex flex-col lg:flex-1 bg-white ">
        <div className="fixed lg:static w-full z-10">
          <ScrollingNavbar  />

        </div>
        <div className="flex-1 mt-16 lg:mt-20">
          <BillingGroupChat department="Billing_Team" />
        </div>
      </div>
    </div>
  )
}

export default BillingGroupHome
