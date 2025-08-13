const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'public', 'images');

// Get all files in the images directory
const files = fs.readdirSync(imagesDir);

// Filter files that contain uppercase characters
const filesToRename = files.filter(file => /[A-Z]/.test(file) && !file.startsWith('WS_FTP'));

console.log(`Found ${filesToRename.length} files to rename to lowercase:`);

filesToRename.forEach(oldName => {
  // Convert to lowercase
  const newName = oldName.toLowerCase();
  
  const oldPath = path.join(imagesDir, oldName);
  const newPath = path.join(imagesDir, newName);
  
  try {
    // Check if the new name already exists
    if (fs.existsSync(newPath)) {
      console.log(`⚠️  Skipping ${oldName} -> ${newName} (target exists)`);
      return;
    }
    
    fs.renameSync(oldPath, newPath);
    console.log(`✓ Renamed: ${oldName} -> ${newName}`);
  } catch (error) {
    console.error(`✗ Error renaming ${oldName}:`, error.message);
  }
});

console.log('\nLowercase renaming complete!');
