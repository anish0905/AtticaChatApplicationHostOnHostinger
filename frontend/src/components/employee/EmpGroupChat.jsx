import React from 'react';
import EmployeeSidebar from './EmployeeSidebar';
import EmpMessage from './EmpMessage';

const EmpGroupChat = () => {
  return (
    <div className="flex flex-col lg:flex-row">
      <div >
        <EmployeeSidebar />
      </div>
      <div className="flex-1 bg-white overflow-hidden ">
        <EmpMessage />
      </div>
    </div>
  );
};

export default EmpGroupChat;
