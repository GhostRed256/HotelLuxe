const fs = require('fs');
const readline = require('readline');

async function readHistory() {
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
      if (step.step_index >= 198 && step.step_index <= 208) {
        console.log(`\n=== STEP ${step.step_index} (${step.source} - ${step.type}) ===`);
        console.log("CONTENT:", step.content);
        if (step.thinking) console.log("THINKING:", step.thinking.substring(0, 1000));
        if (step.tool_calls) console.log("TOOL CALLS:", JSON.stringify(step.tool_calls, null, 2));
      }
    } catch (e) {
      // ignore
    }
  }
}

readHistory().catch(console.error);
