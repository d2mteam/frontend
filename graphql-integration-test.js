/**
 * GraphQL Integration Test Script
 * Run this in browser console (F12) after logging in to test API integration
 */

// Test 1: Check if token exists
console.log('🔑 Testing Token Storage...');
const token = localStorage.getItem('vh_access_token');
console.log(token ? '✅ Token found' : '❌ No token');

// Test 2: Test GraphQL Query (Events)
console.log('\n📊 Testing GraphQL - Get Events...');
fetch('http://localhost:8080/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    query: `
      query {
        findEvents(page: 0, size: 5) {
          content {
            eventId
            title
            memberCount
            creatorInfo {
              username
            }
          }
        }
      }
    `
  })
})
.then(res => res.json())
.then(data => {
  if (data.data?.findEvents) {
    console.log('✅ GraphQL Query Success:', data.data.findEvents.content.length, 'events found');
    console.table(data.data.findEvents.content);
  } else {
    console.error('❌ GraphQL Query Failed:', data.errors);
  }
})
.catch(err => console.error('❌ Network Error:', err));

// Test 3: Test REST Auth
console.log('\n🔐 Testing REST - Refresh Token...');
fetch('http://localhost:8080/api/auth/refresh', {
  method: 'POST',
  credentials: 'include'
})
.then(res => res.json())
.then(data => {
  console.log(data.accessToken ? '✅ REST Auth Success' : '❌ REST Auth Failed');
  console.log(data);
})
.catch(err => console.error('❌ Network Error:', err));

// Test 4: Test GraphQL Mutation (Like)
console.log('\n❤️ Testing GraphQL Mutation - Like...');
// Replace with actual postId from your backend
const testPostId = "773316679898759168";
fetch('http://localhost:8080/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    query: `
      mutation {
        like(input: { targetType: POST, targetId: "${testPostId}" }) {
          ok
          message
        }
      }
    `
  })
})
.then(res => res.json())
.then(data => {
  if (data.data?.like) {
    console.log('✅ Mutation Success:', data.data.like);
  } else {
    console.log('⚠️ Mutation Response:', data.errors?.[0]?.message || 'Unknown error');
  }
})
.catch(err => console.error('❌ Network Error:', err));

console.log('\n✨ All tests initiated! Check results above.');
console.log('📝 Note: Some tests may fail if data does not exist in backend.');
