import "dotenv/config";
import express, { NextFunction, Response, Request } from 'express';
import noteRoutes from './routes/notes';
import morgan from 'morgan';
import createHttpError, { isHttpError } from "http-errors";

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/notes', noteRoutes);

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