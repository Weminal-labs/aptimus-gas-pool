import {
  Account,
  Aptos,
  AptosConfig,
  Deserializer,
  Network,
  SimpleTransaction,
} from "@aptos-labs/ts-sdk";
import { CreateSponsoredTransactionRequest } from "../types";

class SponsoredTransactionService {
  // The sponsor server gets the serialized transaction to sign as the fee payer
  static createSponsorTransaction = async ({
    transactionBytes: transactionBytesBase64,
    // sender,
    // allowedAddresses,
    // allowedMoveCallTargets,
    network = Network.TESTNET,
  }: CreateSponsoredTransactionRequest) => {
    const aptosConfig = new AptosConfig({ network });
    const aptos = new Aptos(aptosConfig);

    // TODO: Aptimus sponsor account
    const sponsor = Account.generate();
    console.log(`Sponsor's address is: ${sponsor.accountAddress}`);

    await aptos.fundAccount({
      accountAddress: sponsor.accountAddress,
      amount: 100000000,
    });

    // Convert the base64 string back to Uint8Array
    const uint8Array = new Uint8Array(
      Buffer.from(transactionBytesBase64, "base64")
    );

    // deserialize raw transaction
    const deserializer = new Deserializer(uint8Array);
    const transaction = SimpleTransaction.deserialize(deserializer);

    // Sponsor signs
    const sponsorAuth = aptos.transaction.signAsFeePayer({
      signer: sponsor,
      transaction,
    });

    const sponsorAuthBytes = sponsorAuth.bcsToBytes();
    const sponsorAuthBytesBase64 =
      Buffer.from(sponsorAuthBytes).toString("base64");

    const signedTransactionBase64 = Buffer.from(transaction.bcsToBytes()).toString(
      "base64"
    );

    return {
      sponsorAuthBytesBase64,
      signedTransactionBase64,
    };
  };
}

export default SponsoredTransactionService;
