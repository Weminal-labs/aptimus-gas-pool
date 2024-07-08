import {
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  EphemeralKeyPair,
  KeylessAccount,
  Network,
} from "@aptos-labs/ts-sdk";
import KeylessService from "../services/keyless.service";
import { toB64 } from "../utils";

const EXAMPLE_JWT =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3Mtc2RrIiwic3ViIjoidGVzdC11c2VyLTAiLCJlbWFpbCI6InRlc3QwQGFwdG9zbGFicy5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzE3MDM5NDg0LCJleHAiOjI3MDAwMDAwMDAsIm5vbmNlIjoiOTM2MTU0NTUyNDkyMDA0ODgwNjUzNDY0MDQ5ODUwMzg4NDk1NDg2NTU2NzM2MjEwNzM0OTIyMTMwMDI4NDIwOTg3NTA5MTM2MjIyOSJ9.ZLZRVJpYfxjNBIdQjeLEniuUsMuBQ7zYm0R0bzKdoIFO4uDTcGrg50-ao_2t89A6EYO0p1uvOC_zCtYsAE57i36kvnX5zCCJwpu7-tMLGsOWCR56H22PgSD7GUcmOp4uePbMPPXp753YrNnlbArEQztfQssI6ScyMVQzNDYW7z2V6esB_GtkEaQzsKDEExDPKC_JBBI__Mek7SQLjFDjbBnWJsGuL4fp2Ux0GVJTaTFvFZMNfNzSQX3Mi93dJFu67xt4UwMUoOxPF1C63SPM53DPBPBPK71dEHug3Z4afgswyEZfNHSotMfhT7D1IEaOzKJnoCSwML5eP0VA0bmGRQ";

const EXAMPLE_EPHEMERAL_KEY_PAIR = new EphemeralKeyPair({
  privateKey: new Ed25519PrivateKey(
    "0x1111111111111111111111111111111111111111111111111111111111111111"
  ),
  expiryDateSecs: 1724497501, // Expires Saturday, August 24, 2024 11:05:01 AM GMT
  blinder: new Uint8Array(31),
});

async function example() {
  const aptosConfig = new AptosConfig({ network: Network.LOCAL });
  const aptos = new Aptos(aptosConfig);

  const pepper = await aptos.getPepper({
    jwt: EXAMPLE_JWT,
    ephemeralKeyPair: EXAMPLE_EPHEMERAL_KEY_PAIR,
  });

  const ephemeralKeyPairBase64 = toB64(EXAMPLE_EPHEMERAL_KEY_PAIR.bcsToBytes());

  const proof = await KeylessService.getProof({
    jwt: EXAMPLE_JWT,
    ephemeralKeyPairBase64,
    network: Network.LOCAL,
  });

  const keylessAccount = KeylessAccount.create({
    proof,
    jwt: EXAMPLE_JWT,
    ephemeralKeyPair: EXAMPLE_EPHEMERAL_KEY_PAIR,
    pepper,
  });

  console.log("Keyless account: ", keylessAccount);
  console.log(
    "Keyless account address: ",
    keylessAccount.accountAddress.toString()
  );
}

example();
