import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
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
import EditImageModal from './EditImageModal'; // Assuming EditImageModal is implemented separately
import EditModel from '../utility/EditModel';

export default function AllUsersFileModel({ sender, recipient, admin, latitude, longitude, senderName }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const anchorRef = useRef(null);
  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const locationInputRef = useRef(null);
  const editModelInputRef = useRef(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  const [sendEditImageClicked, setSendEditImageClicked] = useState(false);

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
    if (event.key === 'Tab' || event.key === 'Escape') {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      anchorRef.current.focus();
    }
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

      handleFileUpload(formData);
    }
  };

  const imgageWithLocation = async (event, fieldName) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append(fieldName, file);
      formData.append('sender', sender);
      formData.append('recipient', recipient);
      formData.append('latitude', latitude.toString());
      formData.append('longitude', longitude.toString());
      formData.append('senderName', senderName);

      handleFileUpload(formData);
    }
  };

  const handleFileUpload = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const url = admin === 'admin' ? `${BASE_URL}/api/empadminsender/createMessage` : `${BASE_URL}/api/postmessages`;
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error uploading file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditModel = (event, fieldName) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Get the URL of the selected image
      setSelectedImageUrl(imageUrl);
      setSendEditImageClicked(true);
    }
  };

  const handleModalClose = () => {
    setSelectedImageUrl(null);
    setSendEditImageClicked(false);
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
                    <MenuItem onClick={() => handleFileInputClick(locationInputRef)}>Image With Location</MenuItem>
                    <MenuItem onClick={() => handleFileInputClick(editModelInputRef)}>Send Edit Image</MenuItem>
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
          ref={locationInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => imgageWithLocation(e, 'image')}
        />
        <input
          ref={editModelInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleEditModel(e, 'editedImage')}
        />
      </div>

      {loading && <CircularProgress className='absolute top-1/2 left-1/2' />}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {selectedImageUrl && sendEditImageClicked && (
  <EditModel
    imageUrl={selectedImageUrl} // Pass the URL instead of the file object
    handleModalClose={handleModalClose}
    admin={admin}
    sender={sender} 
    recipient={recipient}
    senderName={senderName}
  />
)}

    </Stack>
  );
}

AllUsersFileModel.propTypes = {
  sender: PropTypes.string.isRequired,
  recipient: PropTypes.string.isRequired,
  admin: PropTypes.string.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  senderName: PropTypes.string.isRequired,
};
