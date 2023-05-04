import classNames from 'classnames';
import React, { useState } from 'react';
import "./Login.css";

const States = {
  FETCH_IDENTITY_SYMPHONY: 1,
  VALIDATE_IDENTITY: 2,
  SUCCESS: 3,
}

const VALIDATE_TOKEN_URL = window.origin + "/fdc3/v1/auth/jwt";

const REDIRECTION_DELAY = 3; // seconds

function Login({ onSuccess }) {
  const [state, setState] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const handleError = (err) => {
    const message = err?.toString?.();
    if (message) {
      console.error(message);
      setErrorMessage(message);
    }
  }

  const getSymphonyIdentity = async () => {
    setState(States.FETCH_IDENTITY_SYMPHONY);

    try {
      console.log("Raising GetIdentity intent...");
      const resolution = await window.fdc3.raiseIntent(
        "GetIdentity",
        {
          type: "fdc3.get.identity",
          id: {
            appName: "FDC3 Share Identity"
          },
        },
        'symphony',
      );

      const result = await resolution.getResult();

      console.log('GetIdentity result', result);

      if (!result?.id?.jwt) {
        throw new Error("The FDC3 intent result does not contain any jwt");
      }

      return result.id.jwt;
    } catch (error) {
      handleError(error);
    }
  }

  const validateJwt = (jwt) => {
    setState(States.VALIDATE_IDENTITY);

    console.log("Validating user identity...");
    return fetch(VALIDATE_TOKEN_URL, {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ jwt }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
      .then((response) => {
        console.log("Response received:", JSON.stringify(response));
        return response;
      })
      .catch(handleError);
  }


  const handleSubmit = async (event) => {
    event.preventDefault();
    const jwt = await getSymphonyIdentity();

    if (!jwt) {
      return;
    }

    const userContext = await validateJwt(jwt);

    if (userContext) {
      setState(States.SUCCESS);

      setTimeout(() => {
        onSuccess(userContext);
      }, REDIRECTION_DELAY * 1000);
    }
  }

  const renderStateIcon = (targetState) => {
    if (state === targetState) {
      if (!!errorMessage) {
        return <div className="error-icon" />
      }
      return <div className="spinner-icon" />
    }
    return <div className="success-icon" />
  }

  return (
    <div className={classNames("login-page-container", {
      "success": state === States.SUCCESS,
      "error": !!errorMessage,
    })}>
      <div className='login-page'>
        <h1>Login with Symphony FDC3</h1>
        <form onSubmit={handleSubmit}>

          {(!errorMessage && (!state || state < States.SUCCESS)) && (
            <button type="submit" disabled={!!state}>
              {!!state ? (<div className="spinner-icon"></div>) : (<>Login</>)}
            </button>
          )}

          {state === States.SUCCESS && (
            <div className="success-icon big" />
          )}

          {errorMessage && (
            <div className="error-message">
              <span className="error-icon big" />
              {errorMessage}
            </div>
          )}
        </form>

        {!!state && state >= States.FETCH_IDENTITY_SYMPHONY && (
          <>
            <h3>
              {renderStateIcon(States.FETCH_IDENTITY_SYMPHONY)}
              Authentication through Symphony FDC3
            </h3>
            {state === States.FETCH_IDENTITY_SYMPHONY && (<p>Please authorize the connection from your Symphony application</p>)}
          </>
        )}
        {!!state && state >= States.VALIDATE_IDENTITY && (
          <h3>
            {renderStateIcon(States.VALIDATE_IDENTITY)}
            Validation of Symphony identity
          </h3>
        )}

        {!!errorMessage && (
          <button type="button" style={{ 'align-self': 'flex-start' }} onClick={() => { setErrorMessage(undefined); setState(undefined) }}>Retry</button>
        )}
      </div>
    </div>
  );
}

export default Login;
