'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import styles from '../styles/Home.module.css';
import { useAccount, useSignTypedData } from 'wagmi';
import { generateKeyPair } from '../utils/encryption';

const GetPublicKey: NextPage = () => {
  const [publicKey, setPublicKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const handleGetPublicKey = async () => {
    try {
      setIsLoading(true);
      setError('');
      setPublicKey('');

      if (!address) {
        throw new Error('Please connect your wallet first!');
      }

      const keyPair = await generateKeyPair(signTypedDataAsync);
      setPublicKey(keyPair.publicKey);
    } catch (err: any) {
      if (err.code === 4001) {
        setError('You denied the request to get your encryption key.');
      } else {
        setError(err.message || 'Failed to get encryption public key');
      }
      setPublicKey('');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Get Encryption Public Key - RainbowKit App</title>
        <meta content="Get your encryption public key" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        <h1 className={styles.title}>Get Encryption Public Key</h1>

        <div style={{ width: '100%', maxWidth: '600px', margin: '2rem 0' }}>
          <button
            onClick={handleGetPublicKey}
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
            {isLoading ? 'Getting Key...' : 'Get Public Key'}
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

          {publicKey && (
            <div style={{ marginTop: '2rem' }}>
              <h3>Your Encryption Public Key:</h3>
              <div style={{ 
                position: 'relative',
                marginBottom: '1rem'
              }}>
                <textarea
                  value={publicKey}
                  readOnly
                  style={{
                    width: '100%',
                    minHeight: '100px',
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
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Save this public key to use for encryption. Anyone with this key can encrypt messages that only you can decrypt.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GetPublicKey; 