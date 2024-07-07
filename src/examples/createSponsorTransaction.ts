import {
  Account,
  Aptos,
  AptosConfig,
  Deserializer,
  Ed25519PrivateKey,
  EphemeralKeyPair,
  Network,
  SimpleTransaction,
} from "@aptos-labs/ts-sdk";

import SponsoredTransactionService from "../services/sponsoredTransaction.service";

const EXAMPLE_JWT =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtcnNhIn0.eyJpc3MiOiJ0ZXN0Lm9pZGMucHJvdmlkZXIiLCJhdWQiOiJ0ZXN0LWtleWxlc3Mtc2RrIiwic3ViIjoidGVzdC11c2VyLTAiLCJlbWFpbCI6InRlc3QwQGFwdG9zbGFicy5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzE3MDM5NDg0LCJleHAiOjI3MDAwMDAwMDAsIm5vbmNlIjoiOTM2MTU0NTUyNDkyMDA0ODgwNjUzNDY0MDQ5ODUwMzg4NDk1NDg2NTU2NzM2MjEwNzM0OTIyMTMwMDI4NDIwOTg3NTA5MTM2MjIyOSJ9.ZLZRVJpYfxjNBIdQjeLEniuUsMuBQ7zYm0R0bzKdoIFO4uDTcGrg50-ao_2t89A6EYO0p1uvOC_zCtYsAE57i36kvnX5zCCJwpu7-tMLGsOWCR56H22PgSD7GUcmOp4uePbMPPXp753YrNnlbArEQztfQssI6ScyMVQzNDYW7z2V6esB_GtkEaQzsKDEExDPKC_JBBI__Mek7SQLjFDjbBnWJsGuL4fp2Ux0GVJTaTFvFZMNfNzSQX3Mi93dJFu67xt4UwMUoOxPF1C63SPM53DPBPBPK71dEHug3Z4afgswyEZfNHSotMfhT7D1IEaOzKJnoCSwML5eP0VA0bmGRQ";

const EXAMPLE_EPHEMERAL_KEY_PAIR = new EphemeralKeyPair({
  privateKey: new Ed25519PrivateKey(
    "0x1111111111111111111111111111111111111111111111111111111111111111"
  ),
  expiryDateSecs: 1724497501, // Expires Saturday, August 24, 2024 11:05:01 AM GMT
  blinder: new Uint8Array(31),
});

const INITIAL_BALANCE = 100000000;

async function example() {
  // Setup the client
  const aptosConfig = new AptosConfig({ network: Network.LOCAL });
  const aptos = new Aptos(aptosConfig);

  // Derive keyless account from JWT and ephemeral key pair
  const keylessAccount = await aptos.deriveKeylessAccount({
    jwt: EXAMPLE_JWT,
    ephemeralKeyPair: EXAMPLE_EPHEMERAL_KEY_PAIR,
  });
  console.log(
    "Keyless account address: ",
    keylessAccount.accountAddress.toString()
  );

  await aptos.fundAccount({
    accountAddress: keylessAccount.accountAddress,
    amount: INITIAL_BALANCE,
  });

  // Generate Bob's account
  const bob = Account.generate();

  // FE will create this transaction and call to endpoint /v1/transaction-blocks/sponsor
  const transaction = await aptos.transaction.build.simple({
    sender: keylessAccount.accountAddress,
    withFeePayer: true,
    data: {
      function: "0x1::aptos_account::transfer",
      functionArguments: [bob.accountAddress, 1000000],
    },
  });
  console.log("Before sponsor transaction: ", transaction);

  // After calling /v1/transaction-blocks/sponsor, FE will get this signed transaction
  const transactionBytesBase64 = Buffer.from(transaction.bcsToBytes()).toString(
    "base64"
  );
  const { signedTransactionBase64 } =
    await SponsoredTransactionService.createSponsorTransaction({
      transactionBytes: transactionBytesBase64,
      sender: "", // service handle later
      allowedAddresses: [], // service handle later
      allowedMoveCallTargets: [], // service handle later
      network: Network.LOCAL,
    });

  // deserialize raw transaction
  const uint8Array = new Uint8Array(
    Buffer.from(signedTransactionBase64, "base64")
  );
  const deserializerTransaction = new Deserializer(uint8Array);
  const signedTransaction = SimpleTransaction.deserialize(
    deserializerTransaction
  );

  console.log("After sponsor transaction: ", signedTransaction);
}

example();
