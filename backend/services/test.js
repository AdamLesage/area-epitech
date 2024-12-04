import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import util from "util";
import request from "request";
import { Server } from "socket.io";
import http from "http";
import path from "path";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;
const BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAANcxxQEAAAAA4A0HVt67%2Brj%2FqnVLhi9RLOVbE0I%3DD8LtbhA4jL0sSzPuyxECFJIEKZ38XZV3XWmTVkucBBdqlmInav";
const USER_ID = "1861402116448751616"; // Replace with the target user's ID

const post = util.promisify(request.post);
const get = util.promisify(request.get);

const streamURL = `https://api.twitter.com/2/tweets/search/stream?tweet.fields=context_annotations&expansions=author_id&user.fields=username&user_ids=${USER_ID}`;
const rulesURL = "https://api.twitter.com/2/tweets/search/stream/rules";

const errorMessage = {
  title: "Please Wait",
  detail: "Waiting for new Tweets to be posted...",
};

const authMessage = {
  title: "Could not authenticate",
  details: [
    `Please make sure your bearer token is correct. 
      If using Glitch, remix this app and add it to the .env file`,
  ],
  type: "https://developer.twitter.com/en/docs/authentication",
};

const sleep = async (delay) => {
  return new Promise((resolve) => setTimeout(() => resolve(true), delay));
};

// Route pour récupérer les règles existantes
app.get("/api/rules", async (req, res) => {
  if (!BEARER_TOKEN) {
    return res.status(400).send(authMessage);
  }

  const requestConfig = {
    url: rulesURL,
    auth: { bearer: BEARER_TOKEN },
    json: true,
  };

  try {
    const response = await get(requestConfig);
    if (response.statusCode !== 200) {
      return res.status(response.statusCode).send(response.body);
    }
    res.send(response.body);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Route pour ajouter des règles
app.post("/api/rules", async (req, res) => {
  if (!BEARER_TOKEN) {
    return res.status(400).send(authMessage);
  }

  const requestConfig = {
    url: rulesURL,
    auth: { bearer: BEARER_TOKEN },
    json: req.body,
  };

  try {
    const response = await post(requestConfig);
    if (response.statusCode === 200 || response.statusCode === 201) {
      res.send(response.body);
    } else {
      res.status(response.statusCode).send(response.body);
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Gestion du flux de tweets
const streamTweets = (socket) => {
  const config = {
    url: streamURL,
    auth: { bearer: BEARER_TOKEN },
    timeout: 31000,
  };

  const stream = request.get(config);

  stream
    .on("data", (data) => {
      try {
        const tweet = JSON.parse(data);
        const username = tweet.includes.users[0].username;
        console.log(`${username} just tweeted`);
        socket.emit("tweet", tweet);
      } catch (error) {
        socket.emit("heartbeat");
      }
    })
    .on("error", (error) => {
      socket.emit("error", errorMessage);
      reconnect(socket);
    });
};

// Reconnexion en cas de déconnexion
const reconnect = async (socket) => {
  await sleep(10000); // Attendez 10 secondes avant de réessayer
  streamTweets(socket);
};

// Connexion du client Socket.io
io.on("connection", (socket) => {
  console.log("Client connected");
  streamTweets(socket);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
  });
}

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
const streamUserTweets = () => {
  const config = {
    url: streamURL,
    auth: { bearer: BEARER_TOKEN },
    timeout: 31000,
  };

  const stream = request.get(config);

  stream
    .on("data", (data) => {
      try {
        const tweet = JSON.parse(data);
        console.log("Tweet received:");
        if (tweet.data && tweet.data.author_id === USER_ID) {
          console.log(`User with ID ${USER_ID} just tweeted: ${tweet.data.text}`);
        }
      } catch (error) {
        console.log("Error parsing tweet data:", error);
      }
    })
    .on("error", (error) => {
      console.log("Stream error:", error);
      reconnectUserStream();
    });
};

const reconnectUserStream = async () => {
  await sleep(10000); // Wait 10 seconds before retrying
  streamUserTweets();
};

streamUserTweets();