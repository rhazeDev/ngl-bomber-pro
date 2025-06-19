import React, { useState, useContext, useEffect } from 'react';
import { SettingsDialog } from './components/SettingsDialog';
import { GameSlugContext } from './components/GameSlug';
import './App.css';

export default function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [total, setTotal] = useState(0);
  const [success, setSuccess] = useState(0);
  const [failed, setFailed] = useState(0);
  const { gameSlug } = useContext(GameSlugContext);
  const [stopSpam, setStopSpam] = useState(false);
  const [isRandom, setIsRandom] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (stopSpam) {
      StartSpam();
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
        setTimeout(() => {
          if (!stopSpam)  {
            setResponse("Spamming Stopped")
          }
        }, 2000);
      }
    }
  }, [stopSpam]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  function StartSpam() {
    if (stopSpam) {
      const id = setInterval(() => {
        SendMessage();
        if (response === '404') {
          clearInterval(id);
          setIntervalId(null);
        }
      }, 500);
      setIntervalId(id);
    }
  }

  async function SendMessage() {
    const headers = {
      'Content-Type': 'application/json'
    };
    const requestData = {
      username: username,
      question: message,
      gameSlug: gameSlug,
      isRandom: isRandom
    };

    try {
      const res = await fetch("/api/submit", {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData)
      });
      const data = await res.json();
      setResponse(data.message);
      setTotal(prevTotal => prevTotal + 1);
      if (data.message === 'Success') {
        setSuccess(prevSuccess => prevSuccess + 1);
      } else {
        setFailed(prevFailed => prevFailed + 1);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('username').value;
    const messageInput = document.getElementById('message').value;
    if (usernameInput === '') {
      alert('Please enter a username');
      return;
    }

    setUsername(usernameInput);
    setMessage(messageInput);

    if (messageInput === '') {
      setIsRandom(true);
      document.getElementById('random').style.backgroundColor = 'rgba(11, 156, 49, 0.5)';
    }

    setStopSpam(prevStopSpam => {
      const newStopSpam = !prevStopSpam;
      document.getElementById('send-button').innerHTML = newStopSpam ? 'Stop' : 'Start';
      return newStopSpam;
    });
  }

  async function ChangeRandom() {
    setIsRandom(prevIsRandom => {
      const newIsRandom = !prevIsRandom;
      document.getElementById('random').style.backgroundColor = newIsRandom ? 'rgba(11, 156, 49, 0.5)' : 'rgba(255, 255, 255, 0.3)';
      document.getElementById('message').disabled = newIsRandom;
      return newIsRandom;
    });
  }

  return (
    <>
      <div id="total-sent-container">
        <p><strong>Total: &nbsp;</strong></p><p id="total-req">{total}</p>
        <p><strong>&nbsp;&nbsp;&nbsp;&nbsp;Success:&nbsp;</strong></p><p id="total-success">{success}</p>
        <p><strong>&nbsp;&nbsp;&nbsp;&nbsp;Failed:&nbsp;</strong></p><p id="total-failed">{failed}</p>
      </div>
      <div id="container-header">
        <SettingsDialog />
        <textarea id="username" placeholder="Username here..."></textarea>
      </div>
      <form onSubmit={handleSubmit}>
        <div id="message-container">
          <textarea id="message" placeholder="send him spammed messages..."></textarea>
          <div className="random" id="random" onClick={ChangeRandom}>🎲</div>
        </div>
        <div id="response-container">
          <p id="response">{response}</p>
        </div>
        <div id="send-button-container"></div>
        <button id="send-button" type="submit">Start</button>
      </form>
      <p id="creator">Made with 🖤 by&nbsp;&nbsp;<a href="https://github.com/rhazeDev" target='_blank'>rhazeDev</a></p>
    </>
  );
}
