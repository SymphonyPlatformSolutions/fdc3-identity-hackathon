package org.finos.hackathon;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class JwtValidator {
  private static final String PEM_PUB_START = "-----BEGIN PUBLIC KEY-----";
  private static final String PEM_PUB_END = "-----END PUBLIC KEY-----";

  public static void validateJwt(String jwt) {
    try {
      String pemString = IOUtils.resourceToString("/pubKey.pem", StandardCharsets.UTF_8);
      PublicKey pubKey = parsePubKey(pemString);
      Jwts.parserBuilder().setSigningKey(pubKey).build().parseClaimsJws(jwt);
    } catch (GeneralSecurityException | JwtException exception) {
      throw new AuthException("Unable to validate JWT", exception);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  private static PublicKey parsePubKey(String pkPemStr) throws GeneralSecurityException {
    try {
      final String pubKeyString = pkPemStr.replace(PEM_PUB_START, "")
          .replace(PEM_PUB_END, "")
          .replace("\\n", "\n")
          .replaceAll("\\s", "");

      final byte[] keyBytes = Base64.getDecoder().decode(pubKeyString.getBytes(StandardCharsets.UTF_8));

      return KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(keyBytes));
    } catch (InvalidKeySpecException | NoSuchAlgorithmException e) {
      throw new GeneralSecurityException("Unable to parse the pem public key.", e);
    }
  }


}
