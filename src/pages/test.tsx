import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import styles from '../styles/Home.module.css';
import { useAccount, useSignTypedData } from 'wagmi';
import { generateKeyPair, encryptMessage, decryptMessage, generateRandomKeyPair } from '@/utils/encryption';

const TEST_MESSAGE = 'Hello world!';

const Test: NextPage = () => {
  const [results, setResults] = useState<Array<{ step: string; data: string }>>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const addResult = (step: string, data: string) => {
    setResults(prev => [...prev, { step, data }]);
  };

  const runTest = async () => {
    try {
      setIsLoading(true);
      setError('');
      setResults([]);

      if (!address) {
        throw new Error('Please connect your wallet first!');
      }

      // Step 1: Generate Alice's key pair from signature
      addResult('1. Generating Alice\'s key pair...', '');
      const aliceKeyPair = await generateKeyPair(signTypedDataAsync);
      addResult('Alice\'s Key Pair Generated', 
        `Public Key: ${aliceKeyPair.publicKey}\nPrivate Key: ${aliceKeyPair.privateKey}`);

      // Step 2: Generate Bob's random key pair (simulating another user)
      addResult('2. Generating Bob\'s key pair...', '');
      const bobKeyPair = generateRandomKeyPair();
      addResult('Bob\'s Key Pair Generated',
        `Public Key: ${bobKeyPair.publicKey}\nPrivate Key: ${bobKeyPair.privateKey}`);

      // Step 3: Bob encrypts a message for Alice
      addResult('3. Bob encrypting message for Alice...', `Message to encrypt: "${TEST_MESSAGE}"`);
      const encryptedForAlice = encryptMessage(aliceKeyPair.publicKey, TEST_MESSAGE);
      addResult('Encrypted Message (from Bob to Alice)', encryptedForAlice);

      // Step 4: Alice decrypts Bob's message
      addResult('4. Alice decrypting Bob\'s message...', '');
      const decryptedByAlice = decryptMessage(aliceKeyPair.privateKey, encryptedForAlice);
      addResult('Decrypted by Alice', decryptedByAlice);

      // Step 5: Alice encrypts a reply for Bob
      const REPLY_MESSAGE = 'Hello Bob, got your message!';
      addResult('5. Alice encrypting reply for Bob...', `Reply message: "${REPLY_MESSAGE}"`);
      const encryptedForBob = encryptMessage(bobKeyPair.publicKey, REPLY_MESSAGE);
      addResult('Encrypted Reply (from Alice to Bob)', encryptedForBob);

      // Step 6: Bob decrypts Alice's reply
      addResult('6. Bob decrypting Alice\'s reply...', '');
      const decryptedByBob = decryptMessage(bobKeyPair.privateKey, encryptedForBob);
      addResult('Decrypted by Bob', decryptedByBob);

      // Verify
      if (decryptedByAlice === TEST_MESSAGE && decryptedByBob === REPLY_MESSAGE) {
        addResult('✅ Test Result', 'Success! Both messages were correctly encrypted and decrypted.');
      } else {
        throw new Error('Test failed - decrypted messages don\'t match originals');
      }

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Test failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Encryption Test - RainbowKit App</title>
        <meta content="Test asymmetric encryption/decryption" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        <h1 className={styles.title}>Asymmetric Encryption Test</h1>

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