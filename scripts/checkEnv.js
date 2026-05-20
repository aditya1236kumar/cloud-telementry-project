#!/usr/bin/env node
const url = process.env.DATABASE_URL || '';
const jwt = process.env.JWT_SECRET || '';
function fail(msg){
  console.error('ENV CHECK FAILED:', msg);
  process.exit(1);
}
if(!url) fail('DATABASE_URL is not set. Set it in your environment variables.');
if(!/^mongodb(\+srv)?:\/\//.test(url)) fail('DATABASE_URL must start with "mongodb://" or "mongodb+srv://"');
// ensure there's a database path before query params
if(!/\/[^\/?]+(\?|$)/.test(url)) fail('DATABASE_URL must include a database name (e.g. mongodb+srv://.../mydb?...).');
if(!jwt) fail('JWT_SECRET is not set.');
console.log('Environment looks good.');
process.exit(0);
