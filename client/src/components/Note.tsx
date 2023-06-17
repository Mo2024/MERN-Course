import { Card } from "react-bootstrap";
import { Note as NoteModel } from "../models/note"
import styles from '../styles/Note.module.css'
import { formatDate } from "../utils/formatDate";
import { MdDelete } from 'react-icons/md'
import stylesUtils from '../styles/utils.module.css'
import * as NotesApi from '../network/notes_api'

interface NoteProps {
    note: NoteModel,
    className?: string,
    onNoteClick: (note: NoteModel) => void
    onDeleteNoteClick: (note: NoteModel) => void
}
const Note = ({ onNoteClick, note, className, onDeleteNoteClick }: NoteProps) => {
    const { _id, title, text, createdAt, updatedAt } = note;
    let createdUpdatedText: string;
    if (updatedAt > createdAt) {
        createdUpdatedText = "Updated: " + formatDate(updatedAt)
    } else {
        createdUpdatedText = "Created: " + formatDate(createdAt)
    }

    async function handleDelete() {
        try {
            await NotesApi.deleteNote(_id);
            onDeleteNoteClick(note)
        } catch (error) {
            console.error(error);
            alert(error)

        }
    }
    return (
        <Card
            className={`${styles.noteCard} ${className}`}
            onClick={() => onNoteClick(note)}
        >
            <Card.Body className={styles.cardBody}>
                <Card.Title>
                    {title}
                    <MdDelete
                        className={`${stylesUtils.flexCenter} text-muted ms-auto`}
                        onClick={handleDelete}
                    />
                </Card.Title>
                <Card.Text className={styles.cardText}>
                    {text}
                </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
                {createdUpdatedText}
            </Card.Footer>
        </Card>
    );

}
export default Note