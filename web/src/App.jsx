import { useState } from 'react';
import './App.css';
import Login from './Login';

function App() {
  const [loginSuccess, setLoginSuccess] = useState(false);

  return (
    <div>
      {!loginSuccess
        ? (<Login onSuccess={() => setLoginSuccess(true)} />)
        : (<>TODO</>)}
    </div>
  );
}

export default App;
