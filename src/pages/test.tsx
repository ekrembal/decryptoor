import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import styles from '../styles/Home.module.css';
import { useAccount, useSignTypedData } from 'wagmi';
import { encrypt, getEncryptionPublicKey, decrypt } from '@metamask/eth-sig-util';
import { keccak256 } from 'viem';

const TEST_MESSAGE = 'Hello world!';

const EIP712_DOMAIN = {
  name: 'Encryption Key Generator',
  version: '1',
  chainId: 1, // Mainnet, but it doesn't matter for this use case
} as const;

const KEY_GENERATION_TYPE = {
  KeyGeneration: [
    { name: 'purpose', type: 'string' },
  ],
} as const;

interface TestResult {
  step: string;
  data: string;
}

const Test: NextPage = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const addResult = (step: string, data: string) => {
    setResults(prev => [...prev, { step, data }]);
  };

  const generateKeyPair = async () => {
    // Create EIP-712 signature for key generation
    const signature = await signTypedDataAsync({
      domain: EIP712_DOMAIN,
      types: KEY_GENERATION_TYPE,
      primaryType: 'KeyGeneration',
      message: {
        purpose: 'Sign this message to generate your encryption key',
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
  };

  const runTest = async () => {
    try {
      setIsLoading(true);
      setError('');
      setResults([]);

      if (!address) {
        throw new Error('Please connect your wallet first!');
      }

      // Step 1: Generate key pair from signature
      addResult('1. Generating key pair...', '');
      const keyPair = await generateKeyPair();
      addResult('Key Pair Generated', 
        `Public Key: ${keyPair.publicKey}\nPrivate Key: ${keyPair.privateKey}`);

      // Step 2: Encrypt message
      addResult('2. Encrypting message...', `Message to encrypt: "${TEST_MESSAGE}"`);
      const encryptedData = encrypt({
        publicKey: keyPair.publicKey,
        data: TEST_MESSAGE,
        version: 'x25519-xsalsa20-poly1305'
      });
      addResult('Raw Encrypted Data', JSON.stringify(encryptedData, null, 2));

      // Step 3: Convert to hex
      const hexMessage = '0x' + Buffer.from(JSON.stringify(encryptedData), 'utf8').toString('hex');
      addResult('Hex Encoded Message', hexMessage);

      // Step 4: Decrypt using the same key
      addResult('4. Decrypting message...', '');
      
      // Generate the same key pair again by signing the same message
      const decryptKeyPair = await generateKeyPair();
      
      // Verify we got the same keys
      if (decryptKeyPair.publicKey !== keyPair.publicKey) {
        throw new Error('Key regeneration failed - got different key');
      }

      // Convert hex message back to encrypted data
      const encryptedMessage = JSON.parse(Buffer.from(hexMessage.slice(2), 'hex').toString('utf8'));
      
      // Decrypt using eth-sig-util
      const decryptedMessage = decrypt({
        encryptedData: encryptedMessage,
        privateKey: decryptKeyPair.privateKey
      });

      addResult('Decrypted Message', decryptedMessage);

      // Verify
      if (decryptedMessage === TEST_MESSAGE) {
        addResult('✅ Test Result', 'Success! Original message was correctly decrypted.');
      } else {
        addResult('❌ Test Result', `Failed! Expected "${TEST_MESSAGE}" but got "${decryptedMessage}"`);
      }

    } catch (err: any) {
      setError(err.message || 'Test failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Encryption Test - RainbowKit App</title>
        <meta content="Test MetaMask encryption/decryption" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        <h1 className={styles.title}>Encryption Test</h1>

        <div style={{ width: '100%', maxWidth: '800px', margin: '2rem 0' }}>
          <button
            onClick={runTest}
            disabled={isLoading || !address}
            style={{
              backgroundColor: '#0070f3',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: isLoading || !address ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              opacity: isLoading || !address ? 0.7 : 1,
              marginBottom: '1rem'
            }}
          >
            {isLoading ? 'Running Test...' : 'Run Test'}
          </button>

          {error && (
            <div style={{ 
              color: 'red', 
              marginBottom: '1rem',
              padding: '1rem',
              borderRadius: '0.5rem',
              backgroundColor: '#ffebee'
            }}>
              {error}
            </div>
          )}

          {results.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3>Test Results:</h3>
              {results.map((result, index) => (
                <div 
                  key={index} 
                  style={{ 
                    marginBottom: '1rem',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    backgroundColor: '#f5f5f5',
                    fontFamily: 'monospace'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {result.step}
                  </div>
                  {result.data && (
                    <div style={{ 
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      fontSize: '0.9rem'
                    }}>
                      {result.data}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Test; 