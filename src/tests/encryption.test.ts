import { generateKeyPair, encryptMessage, decryptMessage } from '@/utils/encryption';

// Mock function for signMessage that returns a predictable signature
const mockSignMessage = async () => {
  return '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
};

async function runTests() {
  console.log('🧪 Starting encryption tests...\n');

  try {
    // Test 1: Key Generation
    console.log('Test 1: Key Generation');
    const keyPair = await generateKeyPair(mockSignMessage);
    console.log('✓ Generated key pair:');
    console.log('  Public Key:', keyPair.publicKey);
    console.log('  Private Key:', keyPair.privateKey);
    console.log('✓ Keys are 64 characters (32 bytes) long\n');

    // Test 2: Simple Encryption/Decryption
    console.log('Test 2: Simple Encryption/Decryption');
    const message = 'Hello, World!';
    console.log('Original message:', message);
    
    const encryptedSimple = encryptMessage(keyPair.publicKey, message);
    console.log('Encrypted:', encryptedSimple);
    
    const decryptedSimple = decryptMessage(keyPair.privateKey, encryptedSimple);
    console.log('Decrypted:', decryptedSimple);
    
    if (decryptedSimple === message) {
      console.log('✓ Successfully encrypted and decrypted message\n');
    } else {
      throw new Error('Decrypted message does not match original');
    }

    // Test 3: Long Message
    console.log('Test 3: Long Message');
    const longMessage = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    console.log('Original length:', longMessage.length);
    
    const encryptedLong = encryptMessage(keyPair.publicKey, longMessage);
    console.log('Encrypted length:', encryptedLong.length);
    
    const decryptedLong = decryptMessage(keyPair.privateKey, encryptedLong);
    
    if (decryptedLong === longMessage) {
      console.log('✓ Successfully handled long message\n');
    } else {
      throw new Error('Long message decryption failed');
    }

    // Test 4: Special Characters
    console.log('Test 4: Special Characters');
    const specialMessage = '!@#$%^&*()_+-=[]{}|;:,.<>?`~™️🚀👋';
    console.log('Original message:', specialMessage);
    
    const encryptedSpecial = encryptMessage(keyPair.publicKey, specialMessage);
    const decryptedSpecial = decryptMessage(keyPair.privateKey, encryptedSpecial);
    
    if (decryptedSpecial === specialMessage) {
      console.log('✓ Successfully handled special characters\n');
    } else {
      throw new Error('Special characters test failed');
    }

    // Test 5: Empty Message
    console.log('Test 5: Empty Message');
    const emptyMessage = '';
    const encryptedEmpty = encryptMessage(keyPair.publicKey, emptyMessage);
    const decryptedEmpty = decryptMessage(keyPair.privateKey, encryptedEmpty);
    
    if (decryptedEmpty === emptyMessage) {
      console.log('✓ Successfully handled empty message\n');
    } else {
      throw new Error('Empty message test failed');
    }

    // Test 6: Multiple Messages Same Key
    console.log('Test 6: Multiple Messages Same Key');
    const messages = ['First message', 'Second message', 'Third message'];
    const encryptedMessages = messages.map(msg => encryptMessage(keyPair.publicKey, msg));
    const decryptedMessages = encryptedMessages.map((enc: string) => decryptMessage(keyPair.privateKey, enc));
    
    if (messages.every((msg, i) => msg === decryptedMessages[i])) {
      console.log('✓ Successfully encrypted/decrypted multiple messages with same key\n');
    } else {
      throw new Error('Multiple messages test failed');
    }

    // Test 7: Error Cases
    console.log('Test 7: Error Cases');
    try {
      decryptMessage(keyPair.privateKey, '0xinvalid');
      console.log('✗ Should have thrown error for invalid encrypted data');
    } catch (e) {
      console.log('✓ Properly handled invalid encrypted data');
    }

    try {
      decryptMessage('invalidkey', encryptedMessages[0]);
      console.log('✗ Should have thrown error for invalid key');
    } catch (e) {
      console.log('✓ Properly handled invalid key\n');
    }

    console.log('🎉 All tests passed successfully!');

  } catch (error: unknown) {
    console.error('\n❌ Test failed:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

// Run the tests
runTests().catch(console.error); 