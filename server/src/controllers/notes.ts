import { RequestHandler } from "express";
import NoteModel from '../models/note';
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";

export const getNotes: RequestHandler = async (req, res, next) => {
    const authenticatedUser = req.session.userId;
    try {
        assertIsDefined(authenticatedUser)
        const notes = await NoteModel.find({ userId: authenticatedUser }).exec();
        res.status(200).json(notes);
    } catch (error) {
        next(error)
    }
}

export const getNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.id;
    const authenticatedUser = req.session.userId;
    try {
        assertIsDefined(authenticatedUser)
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(404, 'Invalid note id!')
        }
        const note = await NoteModel.findById(noteId).exec();
        if (!note) {
            throw createHttpError(404, 'Note not found!')
        }
        if (!note.userId.equals(authenticatedUser)) {
            throw createHttpError(401, 'You cannot access this note!')
        }
        res.status(200).json(note);
    } catch (error) {
        next(error)
    }
}

interface CreateNoteBody {
    // userId?: 
    title?: string,
    text?: string
}

//we put unkown because these are other parameneter that are not needed, it restrics it
export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
    const { title, text } = req.body;
    const authenticatedUser = req.session.userId;
    try {
        assertIsDefined(authenticatedUser)
        if (!title) {
            throw createHttpError(400, 'Note must have a title!')
        }

        const newNote = await NoteModel.create({ title, text, userId: authenticatedUser });
        res.status(201).json(newNote);
    } catch (error) {
        next(error)
    }
}

interface UpdateNoteParams {
    id?: string,
}
interface UpdateNoteBody {
    title?: string,
    text?: string
}

export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, res, next) => {
    const noteId = req.params.id;
    const { title, text } = req.body;
    const authenticatedUser = req.session.userId;
    try {
        assertIsDefined(authenticatedUser)
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(404, 'Invalid note id!')
        }

        if (!title) {
            throw createHttpError(400, 'Note must have a title!')
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, 'Note not found!')
        }
        if (!note.userId.equals(authenticatedUser)) {
            throw createHttpError(401, 'You cannot access this note!')
        }
        note.title = title;
        note.text = text;
        const updatedNote = await note.save();
        res.status(200).json(updatedNote);
    } catch (error) {
        next(error)
    }
}

export const deleteNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.id;
    const authenticatedUser = req.session.userId;
    try {
        assertIsDefined(authenticatedUser)
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(404, 'Invalid note id!')
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, 'Note not found!')
        }
        if (!note.userId.equals(authenticatedUser)) {
            throw createHttpError(401, 'You cannot access this note!')
        }
        await note.deleteOne();
        res.sendStatus(204);
    } catch (error) {
        next(error)
    }
}