import React from "react";
import {
  Drawer,
  Button,
} from "@material-tailwind/react";
import Chat from "./Chat";
 
export function ChatModel() {
  const [open, setOpen] = React.useState(false);
 
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
 
  return (
    <React.Fragment>
      <Button onClick={openDrawer} className="shadow-none">Open Drawer</Button>
      <Drawer open={open} onClose={closeDrawer} className="p-4">
        
        <div className="flex gap-2">
          <Chat/>  
         
        </div>
      </Drawer>
    </React.Fragment>
  );
}