import { Aptos, AptosConfig, EphemeralKeyPair } from "@aptos-labs/ts-sdk";
import { CreateProofParams } from "../types";
import { fromB64 } from "../utils";

class KeylessService {
  static getProof = async ({
    ephemeralKeyPairBase64,
    jwt,
    network,
  }: CreateProofParams) => {
    const aptosConfig = new AptosConfig({ network });
    const aptos = new Aptos(aptosConfig);

    const ephemeralKeyPair = EphemeralKeyPair.fromBytes(
      fromB64(ephemeralKeyPairBase64)
    );

    const pepper = await aptos.getPepper({ jwt, ephemeralKeyPair });

    return aptos.getProof({ jwt, ephemeralKeyPair, pepper });
  };
}

export default KeylessService;
