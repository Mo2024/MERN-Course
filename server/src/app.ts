import MongoStore from "connect-mongo";
import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import session from "express-session";
import createHttpError, { isHttpError } from "http-errors";
import morgan from 'morgan';
import { requiresAuth } from './middleware/auth';
import noteRoutes from './routes/notes';
import userRoutes from './routes/users';
import env from './util/validateEnv';

const app = express();
app.use(morgan('dev'));
app.use(express.json());

app.use(session({
    secret: env.session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.mongo_connection
    })
}))

app.use('/api/notes', requiresAuth, noteRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"))
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log(error)
    let errorMsg = "An error occured";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMsg = error.message;
    }
    res.status(statusCode).json({ error: errorMsg });
})

export default app;