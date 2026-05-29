const fs = require('fs');
const sa = JSON.parse(fs.readFileSync('serviceAccountKey.json', 'utf8'));
console.log('PROJECT_ID=' + sa.project_id);
console.log('CLIENT_EMAIL=' + sa.client_email);
console.log('PRIVATE_KEY_B64=' + Buffer.from(sa.private_key).toString('base64'));
