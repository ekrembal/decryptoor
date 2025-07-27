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
          content="Encrypt and decrypt your text"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        <h1 className={styles.title}>
          Welcome to the Encryption/Decryption App
        </h1>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2rem',
          width: '100%',
          maxWidth: '800px',
          marginTop: '2rem'
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
                Generate your encryption public key to receive encrypted messages.
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
                Encrypt a message using someone&apos;s public key.
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
                Decrypt messages that were encrypted for you.
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
                Test the complete encryption/decryption flow.
              </p>
            </div>
          </Link>
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
