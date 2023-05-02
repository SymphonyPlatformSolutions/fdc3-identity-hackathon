import classNames from 'classnames';
import React, { useState } from 'react';
import "./Login.css";

const MOCK_JWT = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ0ZXN0IjoyfQ.dEHiqvpIWH7WDBumDsAcLoxf_CBVTIhPe0nwgag54Dp5H3NnHY_av0KyLh0pXyXF02TeNa_6v6Eb6sh6eHKv1EbWzd96btakFmoSQ3UYCIdsAq9OLj9xTbOVLvPUtdwsUPcUnCabTuUtGCwJzW1d6Sp9EBpL2KNZK2GhMwh29fEMsZmWOE2zydR8deujz-A3PFob4zeQgpP5EKQ5mKzwU7mvl9nStS7XqdcTJtztv5WRTyGDDuia3dO43nPTam61bdQL2nRE441i_tbiEuqnx4eom3CiTej0dusowTSVsl8m0t3m4kxjeDERpynhhZ842iigDY7GYjm62IC3riYA2g";

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
      const resolution = await window.fdc3.raiseIntent("GetIdentity", { type: "fdc3.get.identity" });
      const result = await resolution.getResult();
      console.log("Intent response received:", JSON.stringify(result));
      return result.jwt;
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
      handleError(new Error("The FDC3 intent response does not contain any jwt"));
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

        <div className='login-info'>
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
        </div>

        {!!errorMessage && (
          <button type="button" onClick={() => { setErrorMessage(undefined); setState(undefined) }}>Retry</button>
        )}
      </div>
    </div>
  );
}

export default Login;

