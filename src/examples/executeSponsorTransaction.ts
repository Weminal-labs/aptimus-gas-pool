import {
  Account,
  AccountAuthenticator,
  Aptos,
  AptosConfig,
  Deserializer,
  Ed25519PrivateKey,
  EphemeralKeyPair,
  Network,
  SimpleTransaction,
} from "@aptos-labs/ts-sdk";

import SponsoredTransactionService from "../services/sponsoredTransaction.service";
import { fromB64, toB64 } from "../utils";

const INITIAL_BALANCE = 100000000;

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

  const transaction = await aptos.transaction.build.simple({
    sender: keylessAccount.accountAddress,
    withFeePayer: true,
    data: {
      function: "0x1::aptos_account::transfer",
      functionArguments: [bob.accountAddress, 1000000],
    },
  });

  const transactionBytesBase64 = toB64(transaction.bcsToBytes());

  const { sponsorAuthBytesBase64, sponsorSignedTransactionBytesBase64 } =
    await SponsoredTransactionService.createSponsorTransaction({
      transactionBytesBase64,
      sender: "", // service handle later
      allowedAddresses: [], // service handle later
      allowedMoveCallTargets: [], // service handle later
      network: Network.LOCAL,
    });

  // Execute sponsor transaction

  // Alice signs
  const senderAuth = aptos.transaction.sign({
    signer: keylessAccount,
    transaction,
  });

  // deserialize fee payer authenticator
  const deserializer = new Deserializer(fromB64(sponsorAuthBytesBase64));
  const feePayerAuthenticator = AccountAuthenticator.deserialize(deserializer);

  // deserialize raw transaction
  const deserializerTransaction = new Deserializer(
    fromB64(sponsorSignedTransactionBytesBase64)
  );
  const sponsorSignedTransaction = SimpleTransaction.deserialize(
    deserializerTransaction
  );

  const response = await aptos.transaction.submit.simple({
    transaction: sponsorSignedTransaction,
    senderAuthenticator: senderAuth,
    feePayerAuthenticator,
  });

  const executedTransaction = await aptos.waitForTransaction({
    transactionHash: response.hash,
  });
  console.log(
    `Transaction: https://explorer.aptoslabs.com/txn/${executedTransaction.hash}?network=${Network.LOCAL}`
  );
}

example();
