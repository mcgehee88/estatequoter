#!/usr/bin/env node
// This script runs during Netlify build and injects env vars into HTML files

const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: SUPABASE_URL or SUPABASE_ANON_KEY not set');
  process.exit(1);
}

function injectSecrets(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/{{SUPABASE_URL}}/g, supabaseUrl);
  content = content.replace(/{{SUPABASE_ANON_KEY}}/g, supabaseAnonKey);
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Injected secrets into ${filePath}`);
}

// Inject into HTML files
['index.html', 'admin.html', 'pro.html'].forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    injectSecrets(filePath);
  }
});

console.log('✓ Secret injection complete');

