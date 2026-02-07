import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import Home from './views/Home';
import Profile from './views/Profile';
import Upload from './views/Upload';
import Single from './views/Single';

const App = () => {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route path="/single/:id" element={<Single />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
};

export default App;
