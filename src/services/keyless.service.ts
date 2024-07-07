import { Aptos, AptosConfig, EphemeralKeyPair } from "@aptos-labs/ts-sdk";
import { CreateProofParams } from "../types";

class KeylessService {
  static getProof = async ({
    ephemeralKeyPair: ephemeralKeyPairBase64,
    jwt,
    network,
  }: CreateProofParams) => {
    const aptosConfig = new AptosConfig({ network });
    const aptos = new Aptos(aptosConfig);

    // Convert the base64 string back to Uint8Array
    const uint8Array = new Uint8Array(
      Buffer.from(ephemeralKeyPairBase64, "base64")
    );
    // Convert the Uint8Array back to an EphemeralKeyPair
    const ephemeralKeyPair = EphemeralKeyPair.fromBytes(uint8Array);

    const pepper = await aptos.getPepper({ jwt, ephemeralKeyPair });
    return aptos.getProof({ jwt, ephemeralKeyPair, pepper });
  };
}

export default KeylessService;
