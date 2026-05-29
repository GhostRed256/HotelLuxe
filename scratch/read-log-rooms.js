const fs = require('fs');
const logContent = fs.readFileSync('C:\\Users\\tapan\\.gemini\\antigravity\\brain\\6bba9986-311f-4ae6-9e66-773df6b238d2\\.system_generated\\tasks\\task-144.log', 'utf8');

// The log contains JS objects. Let's extract them or print the lines containing "type:" or "name:"
const lines = logContent.split('\n');
let currentRoomId = '';
let currentRoom = {};

lines.forEach(line => {
  if (line.endsWith('=> {')) {
    if (currentRoomId) {
      console.log(`Room: ${currentRoomId}`, currentRoom);
    }
    currentRoomId = line.split(' ')[0];
    currentRoom = {};
  } else if (currentRoomId) {
    const trimmed = line.trim();
    if (trimmed.startsWith('name:')) {
      currentRoom.name = trimmed.split(': ')[1].replace(/['",]/g, '');
    } else if (trimmed.startsWith('type:')) {
      currentRoom.type = trimmed.split(': ')[1].replace(/['",]/g, '');
    } else if (trimmed.startsWith('price:')) {
      currentRoom.price = trimmed.split(': ')[1].replace(/['",]/g, '');
    } else if (trimmed.startsWith('floor:')) {
      currentRoom.floor = trimmed.split(': ')[1].replace(/['",]/g, '');
    } else if (trimmed.startsWith('location:')) {
      currentRoom.location = trimmed.split(': ')[1].replace(/['",]/g, '');
    } else if (trimmed.startsWith('roomNumber:')) {
      currentRoom.roomNumber = trimmed.split(': ')[1].replace(/['",]/g, '');
    }
  }
});
if (currentRoomId) {
  console.log(`Room: ${currentRoomId}`, currentRoom);
}
