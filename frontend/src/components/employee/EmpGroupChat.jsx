import React from 'react';
import EmployeeSidebar from './EmployeeSidebar';
import EmpMessage from './EmpMessage';
import ScrollingNavbar from '../admin/ScrollingNavbar';

const EmpGroupChat = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="flex-shrink-0 mt-20 lg:mt-0">
        <EmployeeSidebar />
      </div>
      <div className="flex flex-col lg:flex-1 bg-white ">
        <div className="fixed lg:static w-full z-10">
          <ScrollingNavbar />
        </div>

        <div className="flex-1 mt-16 lg:mt-20">
          <EmpMessage department="Employee" />

        </div>
      </div>
    </div>
  );
};

export default EmpGroupChat;
