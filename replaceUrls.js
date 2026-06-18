const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'frontend/src');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace 'http://localhost:5000/api...'
  content = content.replace(/'http:\/\/localhost:5000\/api([^']*)'/g, "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api$1`");
  
  // Replace "http://localhost:5000/api..."
  content = content.replace(/"http:\/\/localhost:5000\/api([^"]*)"/g, "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api$1`");
  
  // Replace `http://localhost:5000/api...`
  content = content.replace(/`http:\/\/localhost:5000\/api([^`]*)`/g, "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api$1`");

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.js')) {
      replaceInFile(fullPath);
    }
  }
}

traverseDir(directory);
console.log('Replacement complete.');
