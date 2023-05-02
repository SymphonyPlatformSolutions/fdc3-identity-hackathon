# Finos FDC3 Hackathon

## Tech stack

- Spring boot 3.0.6
- JDK 17

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

## Deployment

Each push will trigger the github action, the new generated docker image is
going to be deployed on GCP under platform solutions project, labs kub cluster.

## Sail config

```json
{
      "appId": "fdc3-share-identity",
      "categories": [
        "chat",
        "communication",
        "compliance",
        "productivity"
      ],
      "contactEmail": "sales@symphony.com",
      "description": "Load your business environment through Symphony FDC3.",
      "type": "web",
      "details": {
        "url": "https://labs.symphonymarket.solutions/fdc3/index.html"
      },
      "icons": [
        {
          "src": "https://fdc3.finos.org/img/users/Symphony.png"
        }
      ],
      "interop": {
        "intents": {
          "raises": {
            "GetIdentity": {
              "contexts": [
                "fdc3.get.identity"
              ],
              "displayName": "Get Identity"
            }
          }
        }
      },
      "moreInfo": "https://symphony.com/",
      "name": "FDC3 Share Identity",
      "publisher": "Symphony Communication Services, LLC",
      "screenshots": [
        {
          "src": "https://symphony.com/wp-content/uploads/2021/09/SYM-Hero-with-C9-1-2048x1688.png"
        }
      ],
      "hostManifests": {
        "sail": {
          "injectApi": "2.0",
          "framesApi": false,
          "allowedOrigins": [
            "https://st3.symphony.com",
            "https://corporate.symphony.com",
            "https://develop2.symphony.com"
          ]
        }
      },
      "supportEmail": "support@symphony.com",
      "title": "FDC3 Share Identity"
    },
```
