FROM openjdk:17-alpine AS builder

WORKDIR /app

COPY /build/libs/*.jar finos-hackathon.jar

RUN jdeps \
    --ignore-missing-deps \
    -q \
    --multi-release 17 \
    --print-module-deps \
    --class-path * \
    finos-hackathon.jar > jre-deps.info

# Create custom JRE
RUN mkdir custom
RUN jlink \
    --output custom/jre \
    --no-header-files \
    --no-man-pages \
    --compress=2 \
    --strip-java-debug-attributes \
    --add-modules $(cat jre-deps.info),java.xml,jdk.unsupported,java.sql,java.naming,java.desktop,java.management,java.security.jgss,java.instrument


FROM alpine:latest
ENV LANG='en_US.UTF-8' LANGUAGE='en_US:en' LC_ALL='en_US.UTF-8'

WORKDIR /deployment

COPY --from=builder /app/custom/jre custom/jre
COPY --from=builder /app/finos-hackathon.jar  finos-hackathon.jar

ENTRYPOINT ["custom/jre/bin/java", "-jar", "finos-hackathon.jar"]
