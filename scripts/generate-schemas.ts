#!/usr/bin/env bun

import { schemaManager } from '../src/generators/generator';

console.log('Generating database schemas from Zod definitions...');

try {
  schemaManager.generateAll();
  console.log('✅ All schemas generated successfully!');
} catch (error) {
  console.error('❌ Error generating schemas:', error);
  process.exit(1);
}
