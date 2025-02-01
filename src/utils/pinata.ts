"server only";

import { PinataSDK } from "pinata-web3";

if (!process.env.PINATA_JWT) {
  throw new Error("PINATA_JWT is not defined");
}
if (!process.env.PINATA_GATEWAY_URL) {
  throw new Error("PINATA_GATEWAY_URL is not defined");
}

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.PINATA_GATEWAY_URL}`,
});
