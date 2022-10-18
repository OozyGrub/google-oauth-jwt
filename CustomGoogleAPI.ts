import axios from "axios";
import crypto from "crypto";
import moment from "moment";
import { toBase64URL } from "./helper/toBase64URL";

export class CustomGoogleAPI {
  private privateKey =
    "-----BEGIN PRIVATE KEY-----PRIVATE_KEY-----END PRIVATE KEY-----\n";

  constructor() {}

  authorize() {
    const header = { alg: "RS256", typ: "JWT" };
    const claimSet = {
      iss: "name@project.iam.gserviceaccount.com",
      iat: moment().unix(),
      exp: moment().add(1, "h").unix(),
      scope: "https://www.googleapis.com/auth/youtube",
      aud: "https://oauth2.googleapis.com/token",
    };

    const encodedHeader = toBase64URL(header);
    const encodedClaimSet = toBase64URL(claimSet);

    const signer = crypto.createSign("RSA-SHA256");
    signer.write(`${encodedHeader}.${encodedClaimSet}`);
    signer.end;

    const signature = signer.sign(this.privateKey, "base64");
    const encodedSignature = signature.replace(/[\+\/=]/g, "");

    const jwt = `${encodedHeader}.${encodedClaimSet}.${encodedSignature}`;

    return axios
      .post("https://oauth2.googleapis.com/token", null, {
        params: {
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion: jwt,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((o) => {
        console.log("OAuth Success");
        console.log(o.data);
        return { status: "ok", data: o.data };
      })
      .catch((e) => {
        console.log("OAuth2 Failed");
        console.log(e.response.status);
        console.log(e.response.data);
        return { status: e.response.status, data: e.response.data };
      });
  }
}
