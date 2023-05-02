import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import "./Login.css";
import { DesktopAgent } from '@finos/fdc3';

const STATES = {
  FETCH_IDENTITY_SYMPHONY: 1,
  VALIDATE_IDENTITY: 2,
  SUCCESS: 3,
  ERROR: 4,
}

// const SYMPHONY_POD_URL = "https://st3.symphony.com";
const VALIDATE_TOKEN_URL = window.origin + "/validate";

const REDIRECTION_DELAY = 3; // s 

function Login({ onSuccess }) {
  const [state, setState] = useState();
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    // window.fdc3.addIntentListener(Intents.StartChat, getStartChatHandler(config));
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();

    const jwt = await getIdentityFromSymphony();
    const validatedJwt = await validateJwt(jwt);

    // if (validatedJwt) {
      setState(STATES.SUCCESS);

      setTimeout(() => {
        onSuccess(validateJwt);
      }, REDIRECTION_DELAY * 1000);
    // }
  }

  const getIdentityFromSymphony = () => {
    setState(STATES.FETCH_IDENTITY_SYMPHONY);

    // window.fdc3.raiseIntent(GetIdentity check payload);

    return new Promise((resolve) => {
      setTimeout(() => resolve('aJwt'), 5000);
    });
  }

  const validateJwt = (jwt) => {
    setState(STATES.VALIDATE_IDENTITY)

    return fetch(VALIDATE_TOKEN_URL, {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify(jwt),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    }).catch((e) => {
      setErrorMessage(e.toString());
      setState(STATES.ERROR);
    })
  }

  return (
    <div className={classNames("login-page-container", {
      "success": state === STATES.SUCCESS,
      "error": state === STATES.ERROR,
    })}>
      <div className='login-page'>
        <h1>Login with Symphony FDC3</h1>
        <form onSubmit={handleSubmit}>

          {(!state || state < STATES.SUCCESS) && (
            <button type="submit" disabled={!!state}>
              {!!state ? (<div className="spinner-icon"></div>) : (<>Login</>)}
            </button>
          )}

          {state === STATES.SUCCESS && (
            <div className="success-icon" />
          )}

          {state === STATES.ERROR && (
            <div>{errorMessage}</div>
          )}
        </form>

        <div className='login-info'>
          {state === STATES.FETCH_IDENTITY_SYMPHONY && (<>
            <h3><div className="spinner-icon"></div>Authenticating through Symphony FDC3...</h3>
            <p>Please authorize the connection from your Symphony application</p>
          </>)}
          {state === STATES.VALIDATE_IDENTITY && (
            <h3><div className="spinner-icon"></div>Validating Symphony identity...</h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;

