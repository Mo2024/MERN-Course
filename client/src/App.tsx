import { useEffect, useState } from 'react';
import styles from './styles/NotesPage.module.css'
import stylesUtils from './styles/utils.module.css'
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import { Container, Row, Col, Button } from "react-bootstrap";
import * as NotesApi from './network/notes_api'
import AddEditNoteDialog from './components/AddEditNoteDialog';
import { FaPlus } from 'react-icons/fa'

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null)
  useEffect(() => {
    async function loadNotes() {
      try {
        const notes = await NotesApi.fetchNotes();
        setNotes(notes)
      } catch (error) {
        console.error(error)
        alert(error)
      }
    }
    loadNotes();
  }, []);

  return (
    <Container>
      <Button
        className={`mb-4 ${stylesUtils.blockCenter} ${stylesUtils.flexCenter}`}
        onClick={() => setShowAddNoteDialog(true)}>
        <FaPlus />
        Add new note
      </Button>
      <Row xs={1} ms={2} xl={3} className='g-4'>
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
