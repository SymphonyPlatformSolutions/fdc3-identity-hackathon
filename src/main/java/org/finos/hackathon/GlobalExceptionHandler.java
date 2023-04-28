package org.finos.hackathon;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

  @ExceptionHandler
  public ResponseEntity<Object> handle(Throwable exception) {
    log.debug("", exception);
    return handle("Internal server error.", HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(AuthException.class)
  public ResponseEntity<Object> handle(AuthException exception) {
    log.debug("", exception);
    return handle(exception.getMessage(), HttpStatus.UNAUTHORIZED);
  }

  private ResponseEntity<Object> handle(String message, HttpStatus status) {
    return ResponseEntity.status(status).body(message);
  }
}
