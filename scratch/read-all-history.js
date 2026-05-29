const fs = require('fs');
const readline = require('readline');

async function searchTranscript() {
  const logPath = 'C:\\Users\\tapan\\.gemini\\antigravity\\brain\\6bba9986-311f-4ae6-9e66-773df6b238d2\\.system_generated\\logs\\transcript.jsonl';
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (!line) continue;
    try {
      const step = JSON.parse(line);
      // We only care about steps before step 192
      if (step.step_index < 192) {
        const contentStr = JSON.stringify(step.content || '').toLowerCase();
        const thinkingStr = JSON.stringify(step.thinking || '').toLowerCase();
        if (contentStr.includes('premium') || contentStr.includes('deluxe') || thinkingStr.includes('premium') || thinkingStr.includes('deluxe')) {
          console.log(`\n=== STEP ${step.step_index} (${step.source}) ===`);
          if (step.content) console.log("CONTENT:", step.content.substring(0, 500));
          if (step.thinking) console.log("THINKING:", step.thinking.substring(0, 500));
        }
      }
    } catch (e) {}
  }
}

searchTranscript().catch(console.error);
