import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/api/submit',async (req, res) => {
  const { username, question, gameSlug, isRandom } = await req.body;
  const messages = JSON.parse(fs.readFileSync('messages.json', 'utf8'));
  const GAMESLUGS = ['', 'confession', '3words', '3neverhave', 'tbh', 'shipme', 'yourcrush', 'cancelled', 'dealbreaker']; 

  function deviceid() {
    const characters = '0123456789abcdef';
    let deviceId = '';
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      deviceId += characters.charAt(randomIndex);
    }
    return deviceId;
  }

  function rand_ip() {
    let ip = [];
    for (let i = 0; i < 4; i++) {
      ip.push(Math.floor(Math.random() * 255));
    }
    return ip.join('.');
  }

  const headers = {
      'Content-Type': 'application/json',
      'Referer': "https://ngl.link/",
      'Origin': 'https://ngl.link',
      'x-forwarded-for': rand_ip()
    };
    const requestData = {
      referrer: "https://l.facebook.com/",
      username: username.toLowerCase(),
      question: isRandom ? messages[Math.floor(Math.random() * messages.length)] : question,
      deviceId: "08ad4bb1-1275-4e4e-acd7-69" + deviceid(),
      gameSlug: gameSlug === 'normal' ? '' : (gameSlug === 'random' ? GAMESLUGS[Math.floor(Math.random() * GAMESLUGS.length)] : gameSlug),
    };

    try {
      fetch("https://ngl.link/api/submit", {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData)
      }).then((response) => {
        console.log(response.status)
        switch(response.status) {
          case 200:
            res.status(200).json({ message: 'Success' });
            break;
          case 400:
            res.status(400).json({ message: 'Bad request' });
            break;
          case 404:
            res.status(404).json({ message: 'User not found' });
            break;
          case 429:
            res.status(429).json({ message: 'Exhausted' });
            break;
          default:
            res.status(500).json({ message: 'Failed' });
            break;
        }
      })
      .catch(error => {
        res.status(500).json({ message: 'Failed' });
      });
    } catch (error) {
      console.log(error.message);
    }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});