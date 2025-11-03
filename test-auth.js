// Test script for new authentication system
import { usersAPI, authenticateUser, getAllUsers } from './src/data/users.js';

async function testAuthentication() {
  console.log('Testing Authentication System...\n');
  
  try {
    // Initialize users
    console.log('1. Initializing users...');
    await usersAPI.ensureInitialized();
    
    // Get all users
    const users = getAllUsers();
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`- ${user.username} (${user.role}) - Has password hash: ${!!user.passwordHash}`);
    });
    
    console.log('\n2. Testing authentication...');
    
    // Test authentication with first user
    if (users.length > 0) {
      const testUser = users[0];
      console.log(`Testing login for: ${testUser.username}`);
      
      // Test with correct password
      const result = await authenticateUser(testUser.username, 'password123');
      if (result.success) {
        console.log('✅ Authentication successful!');
        console.log(`User: ${result.user.name} (${result.user.role})`);
        console.log(`JWT Token: ${result.session.token.substring(0, 50)}...`);
      } else {
        console.log('❌ Authentication failed:', result.error);
      }
      
      // Test with wrong password
      console.log('\n3. Testing wrong password...');
      const wrongResult = await authenticateUser(testUser.username, 'wrongpassword');
      if (!wrongResult.success) {
        console.log('✅ Correctly rejected wrong password:', wrongResult.error);
      } else {
        console.log('❌ Should have rejected wrong password');
      }
    }
    
    console.log('\n4. Testing password hashing...');
    const { AuthService } = await import('./src/services/authService.js');
    const testPassword = 'testpassword123';
    const hash = await AuthService.hashPassword(testPassword);
    console.log(`Original: ${testPassword}`);
    console.log(`Hash: ${hash}`);
    
    const isValid = await AuthService.verifyPassword(testPassword, hash);
    console.log(`Verification: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    
    console.log('\n🎉 Authentication system test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run test
testAuthentication();