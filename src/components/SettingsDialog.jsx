import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { GameSlugContext } from './GameSlug';
import ModeSettings from './ModeSettings';
import "./SettingsDialog.css";

export function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const { gameSlug, setGameSlug } = useContext(GameSlugContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    event.preventDefault();
    setGameSlug(event.target.value);
  }

  return (
    <React.Fragment>
      <FontAwesomeIcon icon={faGear} id="settings" onClick={handleClickOpen} />
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const mode_type = event.target.mode.value;
            setGameSlug(mode_type);
            document.body.style.background = ModeSettings[mode_type].bg_color;
            handleClose();
          },
        }}
      >
        <DialogContent id="settings-dialog">
          <p>Select Mode</p>
          <br />
          <select name="mode" id="mode" onChange={handleChange} value={gameSlug}>
            <optgroup label="Mode">
              <option value="normal">Normal</option>
              <option value="confession">Confession</option>
              <option value="3words">3 Words</option>
              <option value="3neverhave">Never Have</option>
              <option value="tbh">TBH</option>
              <option value="shipme">Ship Me</option>
              <option value="yourcrush">Your Crush</option>
              <option value="cancelled">Cancelled</option>
              <option value="dealbreaker">Deal Breaker</option>
              <option value="random">Random</option>
            </optgroup>
          </select>
          <Button type="submit" id="set-btn">Set</Button>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
