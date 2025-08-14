const fs = require('fs');
const path = require('path');

// Image path mappings
const imagePathMappings = {
  'russell-braun.jpg': null, // Missing image
  'james-conlon-conducting.jpg': 'thm-conlon.jpg',
  'cerny-dallas.jpg': 'thm-cerny.jpg', 
  'richard-goode.jpg': 'thm-gooderichard.jpg',
  'kissine-with-wife-and-c-3-4-10.jpg': 'thm-kissine.jpg',
  'kent-nagano.jpg': 'thm-nagano.jpg',
  'ramey-mephis-faust.jpg': 'thm-ramey.jpg',
  'sarah-chang-informal.jpg': 'thm-chang.jpg',
  'christopher-ventris.jpg': 'thm-ventris.jpg',
  'rolando-villazon.jpg': 'thm-villazon.jpg',
  'tappan-wilder-c-w-2007.jpg': 'thm-wilder.jpg',
  'wnstuttgart10-04.jpg': null // Missing image
};

try {
  // Read the JSON file
  const filePath = './src/data/interviews-specialized.json';
  let content = fs.readFileSync(filePath, 'utf8');
  
  console.log('Fixing image paths...');
  
  // Fix each problematic image path
  for (const [oldPath, newPath] of Object.entries(imagePathMappings)) {
    const oldImagePath = `/images/${oldPath}`;
    
    if (newPath === null) {
      // Handle missing images - replace with placeholder or remove
      console.log(`Removing missing image: ${oldPath}`);
      
      // Replace image objects that reference missing images with empty object
      const imageObjectRegex = new RegExp(`{[^}]*"src":\\s*"${oldImagePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^}]*}`, 'g');
      
      // Replace thumbnail references
      const thumbnailRegex = new RegExp(`"thumbnail":\\s*"${oldImagePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
      content = content.replace(thumbnailRegex, '"thumbnail": null');
      
    } else {
      // Replace with correct image path
      const newImagePath = `/images/${newPath}`;
      console.log(`Replacing ${oldPath} with ${newPath}`);
      
      const oldPathEscaped = oldImagePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const replaceRegex = new RegExp(oldPathEscaped, 'g');
      content = content.replace(replaceRegex, newImagePath);
    }
  }
  
  // Write the updated content back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Image paths fixed successfully!');
  
  // Test JSON validity
  try {
    JSON.parse(content);
    console.log('JSON is valid!');
  } catch (jsonError) {
    console.error('JSON validation failed:', jsonError.message);
    console.log('Attempting to fix JSON syntax issues...');
    
    // Try to fix common JSON issues
    content = content.replace(/,(\s*[\]}])/g, '$1'); // Remove trailing commas
    content = content.replace(/[\u201C\u201D]/g, '"'); // Replace smart quotes
    content = content.replace(/[\u2018\u2019]/g, "'"); // Replace smart apostrophes
    
    fs.writeFileSync(filePath, content, 'utf8');
    
    // Test again
    JSON.parse(content);
    console.log('JSON fixed and is now valid!');
  }
  
} catch (error) {
  console.error('Error fixing image paths:', error.message);
  process.exit(1);
}
