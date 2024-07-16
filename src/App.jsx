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
  const [isRandom, setIsRandom] = useState(false);
  const [shouldSendMessage, setShouldSendMessage] = useState(false);

  useEffect(() => {
    if (shouldSendMessage) {
      StartSpam();
      setShouldSendMessage(false);
    }
  }, [username, message]);

  function StartSpam() {
    SendMessage();
    const intervalId = setTimeout(StartSpam, 500);
    if (response === '404') {
      clearInterval(intervalId);
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


    console.log(requestData)
    try {
      fetch("/api/submit", {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData)
      }).then(response => response.json())
        .then(data => {
          setResponse(data.message);
          setTotal(prevTotal => prevTotal + 1);
          if (data.message === 'Success') {
            setSuccess(prevSuccess => prevSuccess + 1);
          } else {
            setFailed(prevFailed => prevFailed + 1);
          }
        });
    } catch (error) {
      console.log(error.message);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    setUsername(document.getElementById('username').value);
    setMessage(document.getElementById('message').value);
    let usernameInput = document.getElementById('username').value;
    let messageInput = document.getElementById('message').value;
    if (usernameInput === '' || usernameInput === null) {
      alert('Please enter a username');
      return;
    }

    if (messageInput === '' || messageInput === null) {
      setIsRandom(true);
      document.getElementById('random').style.backgroundColor = 'rgba(11, 156, 49, 0.5)';
    }

    setShouldSendMessage(true);
  }

  async function ChangeRandom() {
    setIsRandom(!isRandom);
    document.getElementById('random').style.backgroundColor = isRandom ? 'rgba(255, 255, 255, 0.3)' : 'rgba(11, 156, 49, 0.5)';
    document.getElementById('message').disabled = isRandom;
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
        <button id="send-button" type="submit">Spam Now!</button>
      </form>
      <p id="creator">Made with 🖤 by&nbsp;&nbsp;<a href="https://github.com/RhazeCoder" target='_blank'>RhazeCoder</a></p>
    </>
  );
}