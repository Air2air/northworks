// Quick test of cleanTitle function
function stripHtmlTags(text) {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').trim();
}

function cleanTitle(title) {
  if (!title) return '';
  
  return stripHtmlTags(title)
    .replace(/\s+/g, ' ')
    .trim();
}

// Test cases
const testCases = [
  '<b>Cheryl North Interviews Kurt Masur</b>',
  '<b>National Symphony Orchestra Plays Music from the 1940s</b>',
  'Regular title without HTML',
  '<em>Italic title</em> with <strong>mixed</strong> tags'
];

console.log('Testing cleanTitle function:');
testCases.forEach(test => {
  console.log(`Original: ${test}`);
  console.log(`Cleaned:  ${cleanTitle(test)}`);
  console.log('---');
});
