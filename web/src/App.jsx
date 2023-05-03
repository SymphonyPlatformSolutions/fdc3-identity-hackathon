import { useState } from 'react';
import Login from './Login';
import Portfolio from './Portfolio';

function App() {
  const [userContext, setUserContext] = useState();

  return (
    <>
      {!userContext
        ? (<Login onSuccess={setUserContext} />)
        : (<Portfolio userContext={userContext} />)}
    </>
  );
}

export default App;
