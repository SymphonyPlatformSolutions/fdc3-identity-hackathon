package org.finos.hackathon;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.nio.charset.StandardCharsets;

@Service
@Slf4j
public class SimplePubKeyProvider implements PubKeyProvider {
  @Override
  public String getPubKey() throws Exception {
    log.debug("Reading from pem file the pub key");
    return FileUtils.readFileToString(ResourceUtils.getFile("classpath:pubkey.pem"), StandardCharsets.UTF_8);
//    return IOUtils.resourceToString("pubkey.pem", StandardCharsets.UTF_8, this.getClass().getClassLoader());
  }
}
