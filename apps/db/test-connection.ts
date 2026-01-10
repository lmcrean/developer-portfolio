import { testConnection, isDatabaseAvailable } from './src/connection';

async function main() {
  console.log('Testing NeonDB connection...');
  console.log('Database available:', isDatabaseAvailable());
  
  const result = await testConnection();
  console.log('Connection result:', result);
}

main().catch(console.error);
