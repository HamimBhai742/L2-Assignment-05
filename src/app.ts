import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { globalErrorHandler } from './middlewares/global.error.handaler';
import { notFound } from './middlewares/not.found';
import { router } from './routes/routes';
import passport from 'passport';
import './config/passport';

export const app: Application = express();

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

app.use(
  cors({
    origin: ['http://localhost:5173'],
  })
);

app.use('/api/a5', router);

//running the server
app.get('/', (req: Request, res: Response) => {
  res.send('Digital wallet api server is running!');
});

//global error handler
app.use(globalErrorHandler);

//404 not found handler
app.use(notFound);
