import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import UserList from './pages/userList/UserList';
import UserDetails from './pages/userDetails/UserDetails';
import { store } from './store/store.js';
import { Provider } from 'react-redux';

function App() {

  return (
    <>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<UserList />} />
            <Route path="/user/:id" element={<UserDetails />} />
          </Routes>
        </Router>
      </Provider>
    </>
  )
}

export default App
