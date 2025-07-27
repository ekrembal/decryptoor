import { encrypt, getEncryptionPublicKey, decrypt } from '@metamask/eth-sig-util';
import { keccak256 } from 'viem';

export const EIP712_DOMAIN = {
  name: 'Encryption Key Generator',
  version: '1',
} as const;

export const KEY_GENERATION_TYPE = {
  KeyGeneration: [
    { name: 'purpose', type: 'string' },
  ],
} as const;

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export async function generateKeyPair(signMessage: (message: any) => Promise<string>): Promise<KeyPair> {
  // Create EIP-712 signature for key generation
  const signature = await signMessage({
    domain: EIP712_DOMAIN,
    types: KEY_GENERATION_TYPE,
    primaryType: 'KeyGeneration',
    message: {
      purpose: 'Sign this message to generate your encryption private key',
    },
  });

  // Hash the signature to get a 32-byte private key
  const hash = keccak256(signature as `0x${string}`);
  const privateKey = hash.slice(2); // Remove 0x prefix

  // Generate the public key using eth-sig-util
  const publicKey = getEncryptionPublicKey(privateKey);

  return {
    publicKey,
    privateKey
  };
}

export function encryptMessage(publicKey: string, message: string) {
  const encryptedData = encrypt({
    publicKey,
    data: message,
    version: 'x25519-xsalsa20-poly1305'
  });

  // Convert to hex string for transport
  return '0x' + Buffer.from(JSON.stringify(encryptedData), 'utf8').toString('hex');
}

export function decryptMessage(privateKey: string, encryptedMessage: string): string {
  // Remove 0x prefix if present
  const hexData = encryptedMessage.startsWith('0x') ? encryptedMessage.slice(2) : encryptedMessage;
  
  // Convert hex string back to encrypted data
  const encryptedData = JSON.parse(Buffer.from(hexData, 'hex').toString('utf8'));
  
  // Decrypt using eth-sig-util
  return decrypt({
    encryptedData,
    privateKey
  });
} 