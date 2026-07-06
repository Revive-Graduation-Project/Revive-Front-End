const fs = require('fs');
const path = require('path');
function search(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') search(fullPath);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('localhost') || content.includes('127.0.0.1')) {
        console.log(fullPath);
        const lines = content.split('\n');
        lines.forEach((line, i) => {
          if (line.includes('localhost') || line.includes('127.0.0.1')) console.log(`  ${i+1}: ${line.trim()}`);
        });
      }
    }
  }
}
search('d:\\revive-repo\\Revive-Front-End\\src');
