import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { globalErrorHandler } from './middlewares/global.error.handaler';
import { notFound } from './middlewares/not.found';
import { router } from './routes/routes';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { urlencoded } from 'body-parser';
import './config/passport';

export const app: Application = express();
app.use(
  session({
    secret: process.env.EXPRESS_SESSION as string,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded());

app.use(
  cors({
    origin: ['http://localhost:5173'],
  })
);

app.use('/api/a5', router);

//running the server
app.get('/', (req: Request, res: Response) => {
  res.send('Digital wallet api system server is running!');
});

//global error handler
app.use(globalErrorHandler);

//404 not found handler
app.use(notFound);
