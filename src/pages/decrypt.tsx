import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import styles from '../styles/Home.module.css';
import { useAccount, useSignTypedData } from 'wagmi';
import { generateKeyPair, decryptMessage } from '../utils/encryption';

const Decrypt: NextPage = () => {
  const [text, setText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const handleDecrypt = async () => {
    try {
      setIsLoading(true);
      setError('');
      setDecryptedText('');

      if (!text) {
        throw new Error('Please enter text to decrypt');
      }

      if (!address) {
        throw new Error('Please connect your wallet first!');
      }

      // Generate key pair from signature
      const keyPair = await generateKeyPair(signTypedDataAsync);

      // Decrypt the message
      const decryptedMessage = decryptMessage(keyPair.privateKey, text);
      setDecryptedText(decryptedMessage);
    } catch (err: any) {
      if (err.code === 4001) {
        setError('Decryption was rejected. Please try again and approve the signature in your wallet.');
      } else {
        setError(err.message || 'Failed to decrypt text');
      }
      setDecryptedText('');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (decryptedText) {
      navigator.clipboard.writeText(decryptedText);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Decrypt - RainbowKit App</title>
        <meta content="Decrypt your text" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        <h1 className={styles.title}>Decrypt Text</h1>

        <div style={{ width: '100%', maxWidth: '600px', margin: '2rem 0' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Encrypted Message:
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the encrypted message (should start with 0x)..."
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #ccc'
              }}
            />
          </div>
          
          <button
            onClick={handleDecrypt}
            disabled={isLoading || !text || !address}
            style={{
              backgroundColor: '#0070f3',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: isLoading || !text || !address ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              opacity: isLoading || !text || !address ? 0.7 : 1
            }}
          >
            {isLoading ? 'Decrypting...' : 'Decrypt'}
          </button>

          {error && (
            <div style={{ 
              color: 'red', 
              marginTop: '1rem',
              padding: '1rem',
              borderRadius: '0.5rem',
              backgroundColor: '#ffebee'
            }}>
              {error}
            </div>
          )}

          {decryptedText && (
            <div style={{ marginTop: '2rem' }}>
              <h3>Decrypted Result:</h3>
              <div style={{ 
                position: 'relative',
                marginBottom: '1rem'
              }}>
                <textarea
                  value={decryptedText}
                  readOnly
                  style={{
                    width: '100%',
                    minHeight: '150px',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #ccc',
                    backgroundColor: '#f0f0f0'
                  }}
                />
                <button
                  onClick={copyToClipboard}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid #ccc',
                    borderRadius: '0.25rem',
                    padding: '0.25rem 0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Decrypt; 