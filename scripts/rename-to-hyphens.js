const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'public', 'images');

// Get all files in the images directory
const files = fs.readdirSync(imagesDir);

// Filter files that contain underscores
const filesToRename = files.filter(file => file.includes('_') && !file.startsWith('WS_FTP'));

console.log(`Found ${filesToRename.length} files to rename:`);

filesToRename.forEach(oldName => {
  // Replace underscores with hyphens
  const newName = oldName.replace(/_/g, '-');
  
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

console.log('\nRenaming complete!');
