import express, { Application, Request, Response } from 'express';
import cors from 'cors';

export const app: Application = express();

app.use(express.json());

app.use(
  cors({
    origin: ['http://localhost:5173','https://library-management-client-pink.vercel.app'],
  })
);

//running the server
app.get('/', (req: Request, res: Response) => {
  res.send('Digital wallet api server is running!');
});