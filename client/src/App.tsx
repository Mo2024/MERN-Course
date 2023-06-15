import { useEffect, useState } from 'react';
import styles from './styles/NotesPage.module.css'
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import { Container, Row, Col } from "react-bootstrap";

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);

  useEffect(() => {
    async function loadNotes() {
      try {
        const respone = await fetch("/api/notes", { method: 'GET' });
        const notes = await respone.json();
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
      <Row xs={1} ms={2} xl={3} className='g-4'>
        {notes.map(note => (
          <Col key={note._id}>
            <Note note={note} className={styles.note} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default App;
