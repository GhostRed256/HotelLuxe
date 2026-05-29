const fs = require('fs');
const readline = require('readline');

async function searchTranscript() {
  const logPath = 'C:\\Users\\tapan\\.gemini\\antigravity\\brain\\6bba9986-311f-4ae6-9e66-773df6b238d2\\.system_generated\\logs\\transcript.jsonl';
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
    if (line.toLowerCase().includes('premium')) {
      // Print first 300 chars of the line to see the context
      console.log(`Line ${lineCount}: ${line.substring(0, 300)}...`);
    }
  }
}

searchTranscript().catch(console.error);
