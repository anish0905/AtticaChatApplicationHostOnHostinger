import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import Chat from './Chat';

export default function ChatModel() {
  const [open, setOpen] = React.useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box
      sx={{ width: isSmallScreen ? 250 : 500 }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <Divider />
      <Chat />
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)} className="chat-container">Show Chat</Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
