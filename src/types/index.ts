import {
  Network,
} from "@aptos-labs/ts-sdk";

export interface CreateSponsoredTransactionRequest {
  network: Network;
  transactionBytes: string; // base64 string
  sender: string;
  allowedAddresses: string[];
  allowedMoveCallTargets: string[];
}

export interface CreateSponsoredTransactionResponse {
  sponsorAuthBytes: string; // base64 string
  signedTransaction: string; // base64 string
}

// Create ZKP
export interface CreateProofParams {
  network: Network;
  ephemeralKeyPair: string; // base64 string
  jwt: string; // get from header keyless-jwt
}
