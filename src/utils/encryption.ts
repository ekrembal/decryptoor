import { x25519 } from '@noble/curves/ed25519';
import { randomBytes } from '@stablelib/random';
import { XChaCha20Poly1305 } from '@stablelib/xchacha20poly1305';
import { keccak256 } from 'viem';

const EIP712_DOMAIN = {
  name: 'Encryption Key Generator',
  version: '1',
  chainId: 1,
} as const;

const KEY_GENERATION_TYPE = {
  KeyGeneration: [
    { name: 'purpose', type: 'string' },
  ],
} as const;

// Generate a long-term keypair from an EIP-712 signature
export async function generateKeyPair(signMessage: (message: any) => Promise<string>) {
  // Get signature using EIP-712
  const signature = await signMessage({
    domain: EIP712_DOMAIN,
    types: KEY_GENERATION_TYPE,
    primaryType: 'KeyGeneration',
    message: {
      purpose: 'Sign this message to generate your encryption key',
    },
  });

  // Hash the signature to get a deterministic seed
  const hash = keccak256(signature as `0x${string}`);
  const seed = Buffer.from(hash.slice(2), 'hex');

  // Use the seed as private key (it's already 32 random bytes)
  // x25519 requires the private key to have certain bits set/cleared
  const privateKey = x25519.utils.randomPrivateKey();
  privateKey.set(seed.slice(0, 32));
  privateKey[0] &= 248;
  privateKey[31] &= 127;
  privateKey[31] |= 64;

  const publicKey = x25519.getPublicKey(privateKey);

  return {
    publicKey: Buffer.from(publicKey).toString('hex'),
    privateKey: Buffer.from(privateKey).toString('hex'),
  };
}

// Encrypt a message using recipient's public key
export function encryptMessage(recipientPublicKeyHex: string, messageHex: string): string {
  if (!messageHex.match(/^[0-9a-fA-F]*$/)) {
    throw new Error('Message must be a hex string');
  }

  const recipientPublicKey = Uint8Array.from(Buffer.from(recipientPublicKeyHex, 'hex'));

  // Generate ephemeral keypair for this encryption
  const ephemeralPrivate = x25519.utils.randomPrivateKey();
  const ephemeralPublic = x25519.getPublicKey(ephemeralPrivate);

  // Derive shared secret using ECDH
  const sharedSecret = x25519.scalarMult(ephemeralPrivate, recipientPublicKey);

  // Encrypt using XChaCha20-Poly1305
  const nonce = randomBytes(24);
  const cipher = new XChaCha20Poly1305(sharedSecret);
  const messageBytes = Buffer.from(messageHex, 'hex');
  const ciphertext = cipher.seal(nonce, messageBytes);

  // Combine ephemeralPublic + nonce + ciphertext
  const combined = new Uint8Array(ephemeralPublic.length + nonce.length + ciphertext.length);
  combined.set(ephemeralPublic);
  combined.set(nonce, ephemeralPublic.length);
  combined.set(ciphertext, ephemeralPublic.length + nonce.length);

  return Buffer.from(combined).toString('hex');
}

// Decrypt a message using recipient's private key
export function decryptMessage(recipientPrivateKeyHex: string, encrypted: string): string {
  // Remove '0x' prefix if present
  const cleanHex = encrypted.startsWith('0x') ? encrypted.slice(2) : encrypted;
  const bytes = Buffer.from(cleanHex, 'hex');
  
  // Split the combined data
  const ephemeralPublic = bytes.slice(0, 32);
  const nonce = bytes.slice(32, 56);
  const ciphertext = bytes.slice(56);

  // Convert private key from hex
  const recipientPrivate = Uint8Array.from(Buffer.from(recipientPrivateKeyHex, 'hex'));

  // Derive the same shared secret
  const sharedSecret = x25519.scalarMult(recipientPrivate, ephemeralPublic);
  const cipher = new XChaCha20Poly1305(sharedSecret);

  // Decrypt
  const decrypted = cipher.open(nonce, ciphertext);
  if (!decrypted) {
    throw new Error('Decryption failed - invalid ciphertext or wrong key');
  }

  return Buffer.from(decrypted).toString('hex');
}

// Generate a random keypair (for testing)
export function generateRandomKeyPair() {
  const privateKey = x25519.utils.randomPrivateKey();
  const publicKey = x25519.getPublicKey(privateKey);
  return {
    publicKey: Buffer.from(publicKey).toString('hex'),
    privateKey: Buffer.from(privateKey).toString('hex'),
  };
} 