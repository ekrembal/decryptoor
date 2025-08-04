'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import styles from '../styles/Home.module.css';
import { useAccount } from 'wagmi';
import { encryptMessage } from '../utils/encryption';

const Encrypt: NextPage = () => {
  const [text, setText] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();

  const handleEncrypt = async () => {
    try {
      setIsLoading(true);
      setError('');
      setEncryptedText('');

      if (!text) {
        throw new Error('Please enter hex string to encrypt');
      }
      if (!text.match(/^[0-9a-fA-F]*$/)) {
        throw new Error('Input must be a hex string (0-9, a-f, A-F only)');
      }
      if (!publicKey) {
        throw new Error('Please enter recipient&apos;s encryption public key');
      }

      const encryptedMessage = encryptMessage(publicKey, text);
      setEncryptedText(encryptedMessage);
    } catch (err: any) {
      setError(err.message || 'Failed to encrypt text');
      setEncryptedText('');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (encryptedText) {
      navigator.clipboard.writeText(encryptedText);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Encrypt - RainbowKit App</title>
        <meta content="Encrypt your text" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        <h1 className={styles.title}>Encrypt Text</h1>

        <div style={{ width: '100%', maxWidth: '600px', margin: '2rem 0' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Recipient&apos;s Encryption Public Key:
            </label>
            <textarea
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              placeholder="Enter recipient's encryption public key (from the 'Get Public Key' page)..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #ccc'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Hex String to Encrypt:
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter hex string to encrypt (0-9, a-f, A-F only)..."
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
            onClick={handleEncrypt}
            disabled={isLoading || !text || !publicKey}
            style={{
              backgroundColor: '#0070f3',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: isLoading || !text || !publicKey ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              opacity: isLoading || !text || !publicKey ? 0.7 : 1
            }}
          >
            {isLoading ? 'Encrypting...' : 'Encrypt'}
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

          {encryptedText && (
            <div style={{ marginTop: '2rem' }}>
              <h3>Encrypted Result:</h3>
              <div style={{ 
                position: 'relative',
                marginBottom: '1rem'
              }}>
                <textarea
                  value={encryptedText}
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

export default Encrypt; 