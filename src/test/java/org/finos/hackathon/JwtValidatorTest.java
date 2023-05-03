package org.finos.hackathon;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtValidatorTest {

  @Test
  void validateJwt() {
    final String jwt =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJmaXJzdE5hbWUiOiJBbnRvaW5lIiwibGFzdE5hbWUiOiJSb2xsaW4iLCJleHAiOjE2ODMxMDU2MDMsImlhdCI6MTY4MzEwNTMwMywiZW1haWwiOiJhbnRvaW5lLnJvbGxpbkBzeW1waG9ueS5jb20ifQ.jd7B9tuiyQQu0MAubEr_uXzez42bMihvoSF2GMkOPnAHUbIWI3zzS1wQKfveXqH7W9A4WvqSfDi5pJ_44CnHbS-Hn7F0lAlGm2JTgaeefdXlN70Qpu4wV2cZqT0a5AIXSTRW4uZ_CEphQ8UuZohehucPe-DQfJX56Q6lhSy0EoTKxFhcP8y3sdJ16g1sUS32XxJlSWEYXGi0PpoWL-Z7SLBzeAm_aKWBAyKL5WtBPjNkCORa6Ml33FjQmdTnCvC5aqx9HCBzu0xj7Eo0r2pQvFZXhZAjw61ydJPqbe9q61uMWTBjKCwUu-BujxfpMfZawD2CegP2xGpj97JiE7Ypfw";

    Claims claims = JwtValidator.validateJwt(jwt);
    assertThat(claims).containsKey("email");
  }
}
