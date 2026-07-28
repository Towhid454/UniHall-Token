const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");

const START_PORT = Number(process.env.PORT) || 5000;

const listenOnPort = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => resolve(server));

    server.on("error", reject);
  });

const startServer = async () => {
  await connectDB();

  let port = START_PORT;

  while (true) {
    try {
      await listenOnPort(port);
      console.log(`🚀 Server running on http://localhost:${port}`);
      break;
    } catch (error) {
      if (error.code !== "EADDRINUSE") {
        throw error;
      }

      console.warn(`Port ${port} is in use, trying ${port + 1}...`);
      port += 1;
    }
  }
};

startServer();
