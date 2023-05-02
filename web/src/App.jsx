import { useState } from 'react';
import './App.css';
import Login from './Login';

function App() {
  const [userContext, setUserContext] = useState();

  // TODO: create a specific react component for the logged in user, based on the userContext info
  return (
    <div>
      {!userContext
        ? (<Login onSuccess={setUserContext} />)
        : (<>{JSON.stringify(userContext)}</>)}
    </div>
  );
}

export default App;
