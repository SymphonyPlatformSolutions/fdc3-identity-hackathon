package org.finos.hackathon;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
@RequestMapping("/v1/auth")
@Validated
@Slf4j
public class Application {

  @PostMapping("/jwt")
  public ResponseEntity<Void> validateJwt(@Valid @RequestBody JwtInfo jwtInfo) {
    log.debug("validate jwt");
    JwtValidator.validateJwt(jwtInfo.jwt());
    return ResponseEntity.ok().build();
  }

  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }
}
