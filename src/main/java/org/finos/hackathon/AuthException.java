package org.finos.hackathon;

import java.io.Serial;

public class AuthException extends RuntimeException {
  @Serial
  private static final long serialVersionUID = -4525807064422223707L;

  public AuthException(String msg) {
    super(msg);
  }

  public AuthException(String msg, Throwable cause) {
    super(msg);
    initCause(cause);
  }
}
