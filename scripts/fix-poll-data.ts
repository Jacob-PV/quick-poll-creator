/**
 * Fix existing polls in Redis that have corrupted JSON data
 *
 * This script fixes polls where options were stored as "Yes,No"
 * instead of proper JSON like ["Yes","No"]
 *
 * Usage: npx tsx scripts/fix-poll-data.ts
 */

import { Redis } from '@upstash/redis';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function fixPollData() {
  try {
    console.log('🔍 Searching for polls to fix...\n');

    // Get all poll keys
    const keys = await redis.keys('poll:*');
    const pollKeys = keys.filter((key) => !key.includes(':voters'));

    console.log(`Found ${pollKeys.length} polls\n`);

    for (const pollKey of pollKeys) {
      const pollData = await redis.hgetall(pollKey);

      if (!pollData || !pollData.id) {
        console.log(`⚠️  Skipping invalid poll: ${pollKey}`);
        continue;
      }

      console.log(`\n📊 Checking poll: ${pollData.id}`);
      console.log(`   Question: ${pollData.question}`);
      console.log(`   Options (raw): ${pollData.options}`);
      console.log(`   Votes (raw): ${pollData.votes}`);

      let needsFix = false;
      let fixedOptions = pollData.options;
      let fixedVotes = pollData.votes;

      // Check if options need fixing
      try {
        JSON.parse(pollData.options as string);
        console.log(`   ✅ Options are valid JSON`);
      } catch {
        console.log(`   ❌ Options need fixing`);
        needsFix = true;
        // Handle different data types
        let optionsArray: string[];
        if (typeof pollData.options === 'string') {
          optionsArray = pollData.options.split(',');
        } else if (Array.isArray(pollData.options)) {
          optionsArray = pollData.options.map(String);
        } else {
          optionsArray = [String(pollData.options)];
        }
        fixedOptions = JSON.stringify(optionsArray);
        console.log(`   Fixed options: ${fixedOptions}`);
      }

      // Check if votes need fixing
      try {
        JSON.parse(pollData.votes as string);
        console.log(`   ✅ Votes are valid JSON`);
      } catch {
        console.log(`   ❌ Votes need fixing`);
        needsFix = true;
        // Handle different data types
        let votesArray: number[];
        if (typeof pollData.votes === 'string') {
          votesArray = pollData.votes.split(',').map((v) => parseInt(v) || 0);
        } else if (Array.isArray(pollData.votes)) {
          votesArray = pollData.votes.map((v) => parseInt(String(v)) || 0);
        } else {
          votesArray = [0];
        }
        fixedVotes = JSON.stringify(votesArray);
        console.log(`   Fixed votes: ${fixedVotes}`);
      }

      if (needsFix) {
        // Update the poll with fixed data
        await redis.hset(pollKey, {
          id: String(pollData.id),
          question: String(pollData.question),
          options: fixedOptions,
          votes: fixedVotes,
          createdAt: String(pollData.createdAt),
        });
        console.log(`   ✅ Fixed and updated!`);
      } else {
        console.log(`   ✅ No fixes needed`);
      }
    }

    console.log('\n\n✅ All polls processed successfully!');
  } catch (error) {
    console.error('❌ Error fixing poll data:', error);
    process.exit(1);
  }
}

fixPollData();
