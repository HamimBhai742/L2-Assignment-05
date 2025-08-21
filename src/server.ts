import { Server } from 'http';
import mongoose from 'mongoose';
import { app } from './app';
import { env } from './config/env';

const PORT = process.env.SERVER_PORT || 3000;
let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(`${env.DB_URL}`);
    server = app.listen(PORT, () => {
      console.log('Server is running on port', PORT);
    });
  } catch (error) {
    console.log(error);
  }
};
startServer()

