import classNames from 'classnames';
import React, { useState } from 'react';
import "./Login.css";

const MOCK_JWT = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJpc3MiOiJTeW1waG9ueSBDb21tdW5pY2F0aW9uIFNlcnZpY2VzIExMQy4iLCJzdWIiOjkxMzk2OTEwMzc5NDQsImF1ZCI6ImFwcC1sb2NhbCIsInVzZXIiOnsiaWQiOjkxMzk2OTEwMzc5NDQsImVtYWlsQWRkcmVzcyI6ImFudG9pbmUucm9sbGluQHN5bXBob255LmNvbSIsImZpcnN0TmFtZSI6IkFudG9pbmUiLCJsYXN0TmFtZSI6IlJvbGxpbiIsImRpc3BsYXlOYW1lIjoiQW50b2luZSBSb2xsaW4iLCJjb21wYW55IjoiU3ltcGhvbnkgRW5naW5lZXJpbmcgU2VydmljZXMgRGV2IDQiLCJjb21wYW55SWQiOjEzMywidXNlcm5hbWUiOiJhbnRvaW5lLnJvbGxpbkBzeW1waG9ueS5jb20iLCJhdmF0YXJVcmwiOiIuLi9hdmF0YXJzL3N5bS1zdDMtZGV2LWNoYXQtZ2xiLTEvMTE1MC85MTM5NjkxMDM3OTQ0L1Qzcll6U2tCSDQ3Mk41YTFlNFdDa2k3YVpueEhLMncxcTYtb3JTRHJLcHcucG5nIiwiYXZhdGFyU21hbGxVcmwiOiIuLi9hdmF0YXJzL3N5bS1zdDMtZGV2LWNoYXQtZ2xiLTEvMTUwLzkxMzk2OTEwMzc5NDQvVDNyWXpTa0JINDcyTjVhMWU0V0NraTdhWm54SEsydzFxNi1vclNEcktwdy5wbmcifSwiZXhwIjoxNjg0MjQ0NDkzfQ.qYaEB5pA0b4yJPcpzGOk6LB1dhP5xiXEuzDcqeMV6fCUY8c8eXeJ11fYKmLC1dcRq2d9fvpbFYyOo6NVipTC3rlorjzNtwD_nsJM06W1Zp1gKV9M6UsmEwLfxnkRNJL_9BqgwjJdiMGN2LX2E_GZvlVV1OCY9CM7z73sHzBEUO284cfCamIV2Yzsz_K91bl72uuRpl99dFviM3YLSxlzwjzjoQa3Uv63xAxttaajPXs-bIMcB3biN3OTdFGjKUoo2QaKGt1B4X8oslx6qq7BO9WK114TWuUqxw8ZacDLENntcPV_pzeB37Jlfkl-TWRWqcuveRZ-PtBYlYbKxc4jZw";

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
      // handleError(error);

      // TODO: remove once Sym is ready to handle GetIdentity
      return MOCK_JWT;
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
      </div>
    </div>
  );
}

export default Login;

