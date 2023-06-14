package org.finos.hackathon;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.nio.charset.StandardCharsets;

@Service
@Slf4j
public class SimplePubKeyProvider implements PubKeyProvider {

  @Value("classpath:pubkey.pem")
  Resource pubKeyFile;

  @Override
  public String getPubKey() throws Exception {
    log.debug("Reading from pem file the pub key");
    return StreamUtils.copyToString(pubKeyFile.getInputStream(), StandardCharsets.UTF_8);
  }
}
