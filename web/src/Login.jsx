import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import "./Login.css";
import { DesktopAgent } from '@finos/fdc3';

const States = {
  FETCH_IDENTITY_SYMPHONY: 1,
  VALIDATE_IDENTITY: 2,
  SUCCESS: 3,
  ERROR: 4,
}

const VALIDATE_TOKEN_URL = window.origin + "/fdc3/v1/auth/jwt";

const REDIRECTION_DELAY = 3; // seconds 

function Login({ onSuccess }) {
  const [state, setState] = useState();
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    window.fdc3.addIntentListener('GetIdentityResponse', onGetIdentity);
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();
    raiseGetIdentityIntent();
  }

  const raiseGetIdentityIntent = () => {
    setState(States.FETCH_IDENTITY_SYMPHONY);

    window.fdc3.raiseIntent("GetIdentity", {});

    // todo - remove
    // mock response
    setTimeout(() => {
      onGetIdentity({ jwt: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ0ZXN0IjoyfQ.dEHiqvpIWH7WDBumDsAcLoxf_CBVTIhPe0nwgag54Dp5H3NnHY_av0KyLh0pXyXF02TeNa_6v6Eb6sh6eHKv1EbWzd96btakFmoSQ3UYCIdsAq9OLj9xTbOVLvPUtdwsUPcUnCabTuUtGCwJzW1d6Sp9EBpL2KNZK2GhMwh29fEMsZmWOE2zydR8deujz-A3PFob4zeQgpP5EKQ5mKzwU7mvl9nStS7XqdcTJtztv5WRTyGDDuia3dO43nPTam61bdQL2nRE441i_tbiEuqnx4eom3CiTej0dusowTSVsl8m0t3m4kxjeDERpynhhZ842iigDY7GYjm62IC3riYA2g" });
    }, 3000);
  }

  const onGetIdentity = async (payload) => {
    const userInfo = await validateJwt(payload.jwt);

    if (validatedJwt) {
      setState(States.SUCCESS);

      setTimeout(() => {
        onSuccess(userInfo);
      }, REDIRECTION_DELAY * 1000);
    }
  }

  const validateJwt = (jwt) => {
    setState(States.VALIDATE_IDENTITY)

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
    }).catch((e) => {
      setErrorMessage(e.toString());
      setState(States.ERROR);
    })
  }

  return (
    <div className={classNames("login-page-container", {
      "success": state === States.SUCCESS,
      "error": state === States.ERROR,
    })}>
      <div className='login-page'>
        <h1>Login with Symphony FDC3</h1>
        <form onSubmit={handleSubmit}>

          {(!state || state < States.SUCCESS) && (
            <button type="submit" disabled={!!state}>
              {!!state ? (<div className="spinner-icon"></div>) : (<>Login</>)}
            </button>
          )}

          {state === States.SUCCESS && (
            <div className="success-icon" />
          )}

          {state === States.ERROR && (
            <div>{errorMessage}</div>
          )}
        </form>

        <div className='login-info'>
          {state === States.FETCH_IDENTITY_SYMPHONY && (<>
            <h3><div className="spinner-icon"></div>Authenticating through Symphony FDC3...</h3>
            <p>Please authorize the connection from your Symphony application</p>
          </>)}
          {state === States.VALIDATE_IDENTITY && (
            <h3><div className="spinner-icon"></div>Validating Symphony identity...</h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;

