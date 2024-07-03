import * as React from 'react';
import axios from 'axios';
import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { FaFolderPlus } from 'react-icons/fa';
import { BASE_URL } from '../../constants';

export default function AllUsersFileModel({ sender, recipient, admin, latitude, longitude,senderName }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const anchorRef = React.useRef(null);
  const imageInputRef = React.useRef(null);
  const documentInputRef = React.useRef(null);
  const videoInputRef = React.useRef(null);
  const LocationInputRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleFileInputClick = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = async (event, fieldName) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append(fieldName, file);
      formData.append('sender', sender);
      formData.append('recipient', recipient);
      formData.append('senderName', senderName);

      setLoading(true);
      setError(null);

      try {
        let response;
        if (admin === 'admin') {
          response = await axios.post(`${BASE_URL}/api/empadminsender/createMessage`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } else {
          response = await axios.post(`${BASE_URL}/api/postmessages`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }
        console.log('File uploaded successfully:', response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('Error uploading file. Please try again.');
      } finally {
        setLoading(false);
      }

      event.target.value = null;
    }
  };

  const imgageWithLocation = async (event, fieldName) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append(fieldName, file);
      formData.append('sender', sender);
      formData.append('recipient', recipient);
      formData.append('lat', latitude);
      formData.append('lng', longitude);
      formData.append('senderName', senderName);

      setLoading(true);
      setError(null);

      try {
        let response;
        if (admin === 'admin') {
          response = await axios.post(`${BASE_URL}/api/empadminsender/createMessage`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } else {
          response = await axios.post(`${BASE_URL}/api/postmessages`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }
        console.log('File uploaded successfully:', response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('Error uploading file. Please try again.');
      } finally {
        setLoading(false);
      }

      event.target.value = null;
    }
  };

  return (
    <Stack direction="row" spacing={2}>
      <div>
        <Button
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          sx={{ height: '60px', width: '60px', minWidth: 'unset', color: 'purple' }}
        >
          <FaFolderPlus size={32} />
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem onClick={() => handleFileInputClick(imageInputRef)}>Image</MenuItem>
                    <MenuItem onClick={() => handleFileInputClick(documentInputRef)}>Document</MenuItem>
                    <MenuItem onClick={() => handleFileInputClick(videoInputRef)}>Video</MenuItem>
                    <MenuItem onClick={() => handleFileInputClick(LocationInputRef)}>Image With Location</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFileChange(e, 'image')}
        />
        <input
          ref={documentInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          style={{ display: 'none' }}
          onChange={(e) => handleFileChange(e, 'document')}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFileChange(e, 'video')}
        />
        <input
          ref={LocationInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => imgageWithLocation(e, 'image')}
        />
      </div>

      {loading && <CircularProgress className='absolute top-1/2 left-1/2' />}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </Stack>
  );
}

AllUsersFileModel.propTypes = {
  sender: PropTypes.string.isRequired,
  recipient: PropTypes.string.isRequired,
  admin: PropTypes.string.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
};
