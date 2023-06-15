import { RequestHandler } from "express";
import NoteModel from '../models/note';
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getNotes: RequestHandler = async (req, res, next) => {
    try {
        const notes = await NoteModel.find().exec();
        res.status(200).json(notes);
    } catch (error) {
        next(error)
    }
}

export const getNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.id;
    try {
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(404, 'Invalid note id!')
        }
        const note = await NoteModel.findById(noteId).exec();
        if (!note) {
            throw createHttpError(404, 'Note not found!')
        }
        res.status(200).json(note);
    } catch (error) {
        next(error)
    }
}

interface CreateNoteBody {
    title?: string,
    text?: string
}

//we put unkown because these are other parameneter that are not needed, it restrics it
export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
    const { title, text } = req.body;
    try {
        if (!title) {
            throw createHttpError(400, 'Note must have a title!')
        }

        const newNote = await NoteModel.create({ title, text });
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
    try {
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
    try {
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(404, 'Invalid note id!')
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, 'Note not found!')
        }

        await note.deleteOne();
        res.sendStatus(204);
    } catch (error) {
        next(error)
    }
}