import "dotenv/config";
import express, { NextFunction, Response, Request } from 'express';
import NoteModel from './models/note'
const app = express();
app.get('/', async (req, res, next) => {
    try {
        // throw Error('Error');
        const notes = await NoteModel.find().exec();
        res.status(200).json(notes);
    } catch (error) {
        next(error)
    }
});

app.use((req, res, next) => {
    next(Error("Endpoint not found"))
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log(error)
    let errorMsg = "An error occured";
    if (error instanceof Error) errorMsg = error.message;
    res.status(500).json({ error: errorMsg });
})

export default app;