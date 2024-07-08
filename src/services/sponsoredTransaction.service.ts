import {
  Account,
  Aptos,
  AptosConfig,
  Deserializer,
  Network,
  SimpleTransaction,
} from "@aptos-labs/ts-sdk";
import {
  CreateSponsoredTransactionRequest,
  CreateSponsoredTransactionResponse,
} from "../types";
import { fromB64, toB64 } from "../utils";

class SponsoredTransactionService {
  // The sponsor server gets the serialized transaction to sign as the fee payer
  static createSponsorTransaction = async ({
    transactionBytesBase64,
    // sender,
    // allowedAddresses,
    // allowedMoveCallTargets,
    network = Network.TESTNET,
  }: CreateSponsoredTransactionRequest): Promise<CreateSponsoredTransactionResponse> => {
    const aptosConfig = new AptosConfig({ network });
    const aptos = new Aptos(aptosConfig);

    // TODO: Aptimus sponsor account
    const sponsor = Account.generate();
    console.log(`Sponsor's address is: ${sponsor.accountAddress}`);

    await aptos.fundAccount({
      accountAddress: sponsor.accountAddress,
      amount: 100000000,
    });

    // deserialize raw transaction
    const deserializer = new Deserializer(fromB64(transactionBytesBase64));
    const transaction = SimpleTransaction.deserialize(deserializer);

    // Sponsor signs
    const sponsorAuth = aptos.transaction.signAsFeePayer({
      signer: sponsor,
      transaction,
    });

    const sponsorAuthBytes = sponsorAuth.bcsToBytes();
    const sponsorAuthBytesBase64 = toB64(sponsorAuthBytes);

    const sponsorSignedTransactionBytesBase64 = toB64(transaction.bcsToBytes());

    return {
      sponsorAuthBytesBase64,
      sponsorSignedTransactionBytesBase64,
    };
  };
}

export default SponsoredTransactionService;
