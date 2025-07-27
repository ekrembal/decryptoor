'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Encryption/Decryption App</title>
        <meta
          content="Secure message encryption using X25519-XChaCha20-Poly1305"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        <h1 className={styles.title}>
          Secure Message Encryption
        </h1>

        <p style={{
          textAlign: 'center',
          maxWidth: '800px',
          margin: '2rem auto',
          color: '#666',
          lineHeight: '1.6'
        }}>
          This app uses state-of-the-art cryptography to secure your messages:
        </p>

        <div style={{
          maxWidth: '800px',
          margin: '0 auto 2rem',
          padding: '1.5rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          color: '#333'
        }}>
          <h3 style={{ marginTop: 0 }}>🔐 Encryption Protocol</h3>
          <ul style={{ lineHeight: '1.6' }}>
            <li><strong>Key Generation:</strong> X25519 elliptic curve for key pairs</li>
            <li><strong>Key Agreement:</strong> ECDH (Elliptic Curve Diffie-Hellman) with ephemeral keys</li>
            <li><strong>Encryption:</strong> XChaCha20-Poly1305 AEAD</li>
            <li><strong>Forward Secrecy:</strong> Achieved through ephemeral keys for each message</li>
            <li><strong>Identity Binding:</strong> EIP-712 signatures for deriving persistent keys</li>
          </ul>

          <h3>🛡️ Security Features</h3>
          <ul style={{ lineHeight: '1.6' }}>
            <li><strong>Asymmetric Encryption:</strong> Messages can only be decrypted by the intended recipient</li>
            <li><strong>Authentication:</strong> Poly1305 ensures message integrity and authenticity</li>
            <li><strong>Forward Secrecy:</strong> Compromising one message doesn&apos;t expose others</li>
            <li><strong>Quantum Resistance:</strong> XChaCha20 is considered quantum-computing resistant</li>
          </ul>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2rem',
          width: '100%',
          maxWidth: '800px'
        }}>
          <Link 
            href="/get-public-key" 
            style={{
              padding: '1.5rem',
              textAlign: 'left',
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid #eaeaea',
              borderRadius: '10px',
              transition: 'color 0.15s ease, border-color 0.15s ease',
              minHeight: '180px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <h2 style={{ margin: '0 0 1rem 0' }}>Get Public Key &rarr;</h2>
              <p style={{ margin: '0', fontSize: '1.1rem', lineHeight: '1.5' }}>
                Generate your X25519 public key by signing an EIP-712 message. Share this key with others so they can send you encrypted messages.
              </p>
            </div>
          </Link>

          <Link 
            href="/encrypt" 
            style={{
              padding: '1.5rem',
              textAlign: 'left',
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid #eaeaea',
              borderRadius: '10px',
              transition: 'color 0.15s ease, border-color 0.15s ease',
              minHeight: '180px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <h2 style={{ margin: '0 0 1rem 0' }}>Encrypt &rarr;</h2>
              <p style={{ margin: '0', fontSize: '1.1rem', lineHeight: '1.5' }}>
                Encrypt a message using someone&apos;s public key. Uses ECDH key agreement and XChaCha20-Poly1305 for secure encryption.
              </p>
            </div>
          </Link>

          <Link 
            href="/decrypt" 
            style={{
              padding: '1.5rem',
              textAlign: 'left',
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid #eaeaea',
              borderRadius: '10px',
              transition: 'color 0.15s ease, border-color 0.15s ease',
              minHeight: '180px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <h2 style={{ margin: '0 0 1rem 0' }}>Decrypt &rarr;</h2>
              <p style={{ margin: '0', fontSize: '1.1rem', lineHeight: '1.5' }}>
                Decrypt messages that were encrypted for you. Your private key is securely derived from your wallet signature.
              </p>
            </div>
          </Link>

          <Link 
            href="/test" 
            style={{
              padding: '1.5rem',
              textAlign: 'left',
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid #eaeaea',
              borderRadius: '10px',
              transition: 'color 0.15s ease, border-color 0.15s ease',
              minHeight: '180px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#fafafa'
            }}
          >
            <div>
              <h2 style={{ margin: '0 0 1rem 0' }}>Test Flow &rarr;</h2>
              <p style={{ margin: '0', fontSize: '1.1rem', lineHeight: '1.5' }}>
                Test the complete encryption flow with a simulated conversation between two parties.
              </p>
            </div>
          </Link>
        </div>

        <div style={{
          maxWidth: '800px',
          margin: '2rem auto',
          padding: '1.5rem',
          backgroundColor: '#fff8e1',
          borderRadius: '10px',
          color: '#333'
        }}>
          <h3 style={{ marginTop: 0, color: '#f57c00' }}>⚠️ Important Security Notes</h3>
          <ul style={{ lineHeight: '1.6' }}>
            <li>Your private key is never stored or transmitted - it&apos;s derived from your wallet signature when needed</li>
            <li>Each message uses a unique ephemeral key - even if one message is compromised, others remain secure</li>
            <li>The encryption is done entirely in your browser - messages never touch our servers</li>
            <li>Always verify you&apos;re using the correct public key for the intended recipient</li>
          </ul>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
          Made with ❤️ by your frens at 🌈
        </a>
      </footer>
    </div>
  );
};

export default Home;
