const fs = require('fs');
const path = require('path');
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            if (!file.includes('node_modules') && !file.includes('dist') && !file.includes('.git') && !file.includes('venv') && !file.includes('.venv')) {
                results = results.concat(walk(file));
            }
        } else { 
            results.push(file);
        }
    });
    return results;
}
const files = walk('d:\\revive-repo\\revive-backend');
files.forEach(f => {
    try {
        const content = fs.readFileSync(f, 'utf8');
        if(content.toLowerCase().includes('localhost')) {
            console.log(f);
        }
    } catch(e) {}
});
