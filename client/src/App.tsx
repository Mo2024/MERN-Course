import { useEffect, useState } from 'react';
import styles from './styles/NotesPage.module.css'
import stylesUtils from './styles/utils.module.css'
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import * as NotesApi from './network/notes_api'
import AddEditNoteDialog from './components/AddEditNoteDialog';
import { FaPlus } from 'react-icons/fa'

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null)
  useEffect(() => {
    async function loadNotes() {
      try {
        setShowNotesLoadingError(false)
        setNotesLoading(true)
        const notes = await NotesApi.fetchNotes();
        setNotes(notes)
      } catch (error) {
        console.error(error)
        setShowNotesLoadingError(true)
      } finally {
        setNotesLoading(false)
      }
    }
    loadNotes();
  }, []);

  const notesGrid =
    <Row xs={1} ms={2} xl={3} className={`${styles.notesGrid} g-4`}>
      {notes.map(note => (
        <Col key={note._id}>
          <Note
            note={note}
            className={styles.note}
            onDeleteNoteClick={(deletedNote) => {
              setNotes(notes.filter(note => note._id !== deletedNote._id));
            }}
            onNoteClick={setNoteToEdit}
          />
        </Col>
      ))}
    </Row>

  return (
    <Container className={`${styles.NotesPage}`}>
      <Button
        className={`mb-4 ${stylesUtils.blockCenter} ${stylesUtils.flexCenter}`}
        onClick={() => setShowAddNoteDialog(true)}>
        <FaPlus />
        Add new note
      </Button>
      {notesLoading && <Spinner animation='border' variant='primary' />}
      {showNotesLoadingError && <p>Something went wrong. Please refresh the page</p>}
      {!notesLoading && !showNotesLoadingError &&
        <>
          {notes.length > 0 ? notesGrid : <p>You don't have any notes yet</p>}
        </>
      }
      {
        showAddNoteDialog &&
        <AddEditNoteDialog
          onDismiss={() => setShowAddNoteDialog(false)}
          onNoteSaved={(newNote) => {
            setShowAddNoteDialog(false);
            setNotes([...notes, newNote])
          }} />
      }
      {
        noteToEdit &&
        <AddEditNoteDialog
          noteToEdit={noteToEdit}
          onDismiss={() => setNoteToEdit(null)}
          onNoteSaved={(updatedNote) => {
            setNotes(notes.map(existingNote => existingNote._id === updatedNote._id ? updatedNote : existingNote))
            setNoteToEdit(null)
          }}
        />
      }
    </Container >
  );
}

export default App;
