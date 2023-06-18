import { Note as NoteModel } from '../models/note';

export default async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) return response;
    const errorBody = await response.json();
    const errorMsg = errorBody.console.error();
    throw Error(errorMsg)
}

export async function fetchNotes(): Promise<NoteModel[]> {
    const respone = await fetchData("/api/notes", { method: 'GET' });
    return await respone.json();
}

export interface NoteInput {
    title: string,
    text?: string
}

export async function createNote(note: NoteInput): Promise<NoteModel> {
    const respone = await fetchData('/api/notes',
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(note)
        });
    return respone.json();

}
export async function updateNote(noteId: string, note: NoteInput): Promise<NoteModel> {
    const respone = await fetchData('/api/notes/' + noteId,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(note)
        });
    return respone.json();

}
export async function deleteNote(noteId: string) {
    await fetchData('/api/notes/' + noteId, { method: "DELETE" });
}