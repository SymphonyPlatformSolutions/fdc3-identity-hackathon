# Finos FDC3 Hackathon

## Tech stack

- Spring boot 3.0.6
- JDK 17
- ReactJS

## BE Jwt validation endpoint

POST /fdc3/v1/auth/jwt

```yaml
{
  "jwt": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ0ZXN0IjoyfQ.dEHiqvpIWH7WDBumDsAcLoxf_CBVTIhPe0nwgag54Dp5H3NnHY_av0KyLh0pXyXF02TeNa_6v6Eb6sh6eHKv1EbWzd96btakFmoSQ3UYCIdsAq9OLj9xTbOVLvPUtdwsUPcUnCabTuUtGCwJzW1d6Sp9EBpL2KNZK2GhMwh29fEMsZmWOE2zydR8deujz-A3PFob4zeQgpP5EKQ5mKzwU7mvl9nStS7XqdcTJtztv5WRTyGDDuia3dO43nPTam61bdQL2nRE441i_tbiEuqnx4eom3CiTej0dusowTSVsl8m0t3m4kxjeDERpynhhZ842iigDY7GYjm62IC3riYA2g",
}
```

Response

- 200: jwt is valid, with UserClaim payload
- 400: jwt is not valid, bad request
- 500: server error

## Configuration

### Sail application

- clone the Sail app locally: https://github.com/finos/FDC3-Sail
- take the `local.v2.json` file from this project and paste it in the Sail `/directory` folder
- in `local.v2.json`:
- - for the `fdc3-share-identity` app, update the `details.url` with the application URL
- - for the `symphony` app: 
- - - update the `details.url` with your target Symphony pod URL
- - - add also this URL to the `hostManifests.sail.allowedOrigins`

### CleverTrade server

Symphony Pod URL must be configured in the `application.yaml`, from where the public key is pulled and used to validate the jwt in the http request.

```yaml
app:
  pod-uri: https://st3.symphony.com

```

### Scenario

- start the FDC3 Sail app with:
```sh
npm install
export SAIL_DIRECTORY_URL=directory/local.v2.json
npm start
```

- from Sail, open the Symphony app (for now it's pointing at st3 pod)
- log in with an account
- open the CleverTrade Portfolio app
- click the Login button (it opens the Symphony app with the previously logged in user)
- click "Accept" form the dialog that appeared on the Symphony app
- focus the CleverTrade Portfolio app, it should show success statuses for all steps and redirect to the custom portfolio view




