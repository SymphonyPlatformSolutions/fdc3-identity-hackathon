package org.finos.hackathon;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public record JwtInfo(@NotBlank(message = "Jwt is mandatory") String jwt) {

  @JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
  public JwtInfo(@JsonProperty("jwt") String jwt) {
    this.jwt = jwt;
  }
}
