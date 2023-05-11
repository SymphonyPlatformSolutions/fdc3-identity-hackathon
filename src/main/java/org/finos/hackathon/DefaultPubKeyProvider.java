package org.finos.hackathon;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
@Slf4j
public class DefaultPubKeyProvider implements PubKeyProvider {
  private final String pubKeyUri;
  private static final String pubKeyPath = "/client-bff/v1/jwt/publicKey";

  public DefaultPubKeyProvider(@Value("${app.pod-uri}") String podUri) {
    pubKeyUri = podUri + pubKeyPath;
  }


  @Override
  public String getPubKey() throws Exception {
    HttpClient httpClient = HttpClient.newHttpClient();
    HttpRequest request =
        HttpRequest.newBuilder().uri(new URI(pubKeyUri)).version(HttpClient.Version.HTTP_1_1).GET().build();
    log.debug("Call URL {} to retrieve the pub key", pubKeyUri);
    HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
    return response.body();
  }
}
