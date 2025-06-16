'use server'

import { apiStore } from './lib/api-store'
import { redirect } from 'next/navigation'

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function createNewInstance() {
  console.log('Server action: createNewInstance called')
  
  try {
    console.log('Server action: Creating instance...');
    const instance = await apiStore.createInstance('New Instance', 'A new mock API instance');
    console.log('Server action: Instance created successfully:', instance.id);
    
    // Return the instance ID instead of redirecting
    return { id: instance.id };
  } catch (error) {
    console.error('Server action: Error creating instance:', error);
    throw new Error('Failed to create API instance');
  }
}

export async function getInstance(id: string) {
  console.log('Server action: getInstance called for:', id)
  
  try {
    const instance = await apiStore.getInstance(id);
    if (!instance) {
      throw new Error('Instance not found');
    }
    return instance;
  } catch (error) {
    console.error('Server action: Error getting instance:', error);
    throw new Error('Failed to get API instance');
  }
} 