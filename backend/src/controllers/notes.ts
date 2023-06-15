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

//wer put unkown because these are other parameneter that are not needed, it restrics it
export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
    const { title, text } = req.body;
    try {
        if (!title) {
            throw createHttpError(400, 'Note must have a title!')
        }

        const newNote = await NoteModel.create({ title: title, text: text });
        res.status(201).json(newNote);
    } catch (error) {
        next(error)
    }
}

