import { Network } from "@aptos-labs/ts-sdk";

export interface CreateSponsoredTransactionRequest {
  network: Network;
  transactionBytesBase64: string;
  sender: string;
  allowedAddresses: string[];
  allowedMoveCallTargets: string[];
}

export interface CreateSponsoredTransactionResponse {
  sponsorAuthBytesBase64: string;
  sponsorSignedTransactionBytesBase64: string;
}

// Create ZKP
export interface CreateProofParams {
  network: Network;
  ephemeralKeyPairBase64: string;
  jwt: string; // get from header keyless-jwt
}
