import { Container } from "react-bootstrap";
import LoginModal from './components/LoginModal';
import NavBar from './components/NavBar';
import SignUpModal from './components/SignUpModal';
import styles from './styles/NotesPage.module.css';
import { useEffect, useState } from "react";
import { User } from "./models/user";
import * as UserApi from "./network/user_api";
import NotesPageLoggedInView from "./components/NotesPageLoggedInView";
import NotesPagesLoggedOutView from "./components/NotesPagesLoggedOutView";

function App() {


  const [loggedInUser, setLoggedInUser] = useState<User | null>(null)

  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await UserApi.getLoggedInUser()
        setLoggedInUser(user)
      } catch (error) {
        console.log(error)
      }
    }
    fetchLoggedInUser()
  }, [])

  return (
    <div>
      <NavBar
        loggedInUser={loggedInUser}
        onSignUpClicked={() => { setShowSignUpModal(true) }}
        onLoginClicked={() => { setShowLoginModal(true) }}
        onLogoutSuccessful={() => setLoggedInUser(null)}
      />


      <Container className={`${styles.NotesPage}`}>
        <>
          {loggedInUser ? <NotesPageLoggedInView /> : <NotesPagesLoggedOutView />}
        </>
      </Container >
      {showSignUpModal && <SignUpModal onDismiss={() => { setShowSignUpModal(false) }} onSignUpSuccessful={(user) => { setLoggedInUser(user); setShowSignUpModal(false) }} />}
      {showLoginModal && <LoginModal onDismiss={() => { setShowLoginModal(false) }} onLoginSuccessful={(user) => { setLoggedInUser(user); setShowLoginModal(false) }} />}
    </div>
  );
}

export default App;
