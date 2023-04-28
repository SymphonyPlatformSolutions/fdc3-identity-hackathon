package org.finos.hackathon;

import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/auth")
@Validated
@Slf4j
public class Application {

  private final PubKeyProvider pubKeyProvider;

  @PostMapping("/jwt")
  public ResponseEntity<Claims> validateJwt(@Valid @RequestBody JwtInfo jwtInfo) {
    log.debug("validate jwt");
    String pubKey = getPubKey();
    Claims claims = JwtValidator.validateJwt(jwtInfo.jwt(), pubKey);
    return ResponseEntity.ok().body(claims);
  }

  private String getPubKey() {
    try {
      return pubKeyProvider.getPubKey();
    } catch (Exception e) {
      throw new RuntimeException("Cannot retrieve public key.", e);
    }
  }

  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }
}
