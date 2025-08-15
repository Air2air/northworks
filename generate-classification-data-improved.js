const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDir = path.join(__dirname, 'public', 'content');

// Helper function to safely parse frontmatter
function parseContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(content);
    return {
      frontmatter: parsed.data,
      content: parsed.content,
      slug: path.basename(filePath, '.md')
    };
  } catch (error) {
    console.warn(`Warning: Could not parse ${filePath}:`, error.message);
    return null;
  }
}

// Helper function to create content item for Cheryl content (individual files)
function createContentItem(fileData, type, category) {
  if (!fileData) return null;
  
  const { frontmatter, content, slug } = fileData;
  
  return {
    metadata: {
      id: slug,
      type: type,
      category: category,
      status: 'published',
      source: 'markdown',
      lastModified: new Date().toISOString()
    },
    content: {
      title: frontmatter.title || 'Untitled',
      summary: content.substring(0, 200).replace(/[#*_\[\]]/g, '').trim() + '...',
      fullContent: content,
      url: `/${category}/${slug}`
    },
    subject: frontmatter.subjects ? {
      topics: frontmatter.subjects
    } : undefined,
    publication: frontmatter.publication ? {
      date: frontmatter.publication.date,
      publisher: frontmatter.publication.publisher,
      author: frontmatter.publication.author
    } : undefined,
    media: frontmatter.images ? {
      images: frontmatter.images.map(img => ({
        url: img.src,
        alt: img.alt || frontmatter.title,
        type: img.type || 'image'
      }))
    } : undefined,
    tags: frontmatter.subjects || frontmatter.tags || []
  };
}

// Helper function to extract Warner Professional items (table-based with thumbnails)
function extractWarnerProfessionalItems(fileData) {
  if (!fileData) return [];
  
  const { frontmatter, content, slug } = fileData;
  const items = [];
  
  // Split content by image patterns that indicate table rows
  const sections = content.split(/(?=!\[.*?\]\(.*?\))/);
  
  let itemCounter = 1;
  
  for (const section of sections) {
    const trimmedSection = section.trim();
    if (trimmedSection.length < 100) continue; // Skip very short sections
    
    // Extract thumbnail image
    const imageMatch = trimmedSection.match(/!\[.*?\]\((.*?)\)/);
    const thumbnail = imageMatch ? imageMatch[1] : null;
    
    // Extract organization name (usually in bold after the image)
    let organizationName = 'Untitled';
    const orgMatches = [
      trimmedSection.match(/\*\*(.*?)\*\*/), // Bold text
      trimmedSection.match(/\[(.*?)\]/), // Link text
    ];
    
    for (const match of orgMatches) {
      if (match && match[1] && match[1].trim().length > 2) {
        organizationName = match[1].trim();
        break;
      }
    }
    
    // Extract project description (text after organization name)
    const descriptionStart = trimmedSection.indexOf('****');
    const description = descriptionStart > -1 ? 
      trimmedSection.substring(descriptionStart + 4).trim() : 
      trimmedSection.replace(/!\[.*?\]\(.*?\)/, '').trim();
    
    // Extract links
    const linkMatches = trimmedSection.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
    const links = linkMatches.map(link => {
      const match = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
      return { text: match[1], url: match[2] };
    });
    
    // Create item
    const item = {
      metadata: {
        id: `${slug}-prof-${itemCounter}`,
        type: 'professional',
        category: 'professional',
        status: 'published',
        source: 'markdown-table',
        parentFile: slug,
        lastModified: new Date().toISOString()
      },
      content: {
        title: organizationName,
        summary: description.substring(0, 200).replace(/[#*_\[\]!]/g, '').trim() + '...',
        fullContent: description,
        url: `/professional/${slug}#prof-${itemCounter}`,
        links: links,
        thumbnail: thumbnail
      },
      subject: frontmatter.subjects ? {
        topics: frontmatter.subjects
      } : undefined,
      publication: frontmatter.publication ? {
        date: frontmatter.publication.date,
        publisher: frontmatter.publication.publisher,
        author: frontmatter.publication.author
      } : undefined,
      tags: frontmatter.subjects || frontmatter.tags || []
    };
    
    items.push(item);
    itemCounter++;
  }
  
  return items;
}

// Helper function to extract Warner Publication items (paragraph-based)
function extractWarnerPublicationItems(fileData) {
  if (!fileData) return [];
  
  const { frontmatter, content, slug } = fileData;
  const items = [];
  
  // Split by paragraph breaks or publication patterns
  const sections = content.split(/\n\n+/);
  
  let itemCounter = 1;
  
  for (const section of sections) {
    const trimmedSection = section.trim();
    if (trimmedSection.length < 80) continue; // Skip very short sections
    if (trimmedSection.startsWith('***') || trimmedSection.startsWith('DOWNLOAD')) continue; // Skip headers
    
    // Extract title (often in quotes or bold)
    let title = 'Untitled';
    const titleMatches = [
      trimmedSection.match(/"([^"]+)"/), // Quoted text
      trimmedSection.match(/\*\*(.*?)\*\*/), // Bold text
      trimmedSection.match(/\[(.*?)\]/), // Link text
      trimmedSection.match(/^([^,\n]+)/), // First part before comma or newline
    ];
    
    for (const match of titleMatches) {
      if (match && match[1] && match[1].trim().length > 5) {
        title = match[1].trim();
        break;
      }
    }
    
    // Extract journal/publisher info
    const journalMatch = trimmedSection.match(/\*\*([^*]+)\*\*/);
    const journal = journalMatch ? journalMatch[1] : null;
    
    // Extract year
    const yearMatch = trimmedSection.match(/(\d{4})/);
    const year = yearMatch ? yearMatch[1] : null;
    
    // Extract links (including PDF links)
    const linkMatches = trimmedSection.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
    const links = linkMatches.map(link => {
      const match = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
      return { text: match[1], url: match[2] };
    });
    
    // Check for PDF files
    const hasPDF = links.some(link => link.url.endsWith('.pdf')) || 
                   trimmedSection.includes('.pdf');
    
    // Create item
    const item = {
      metadata: {
        id: `${slug}-pub-${itemCounter}`,
        type: 'publication',
        category: 'publications',
        status: 'published',
        source: 'markdown-paragraph',
        parentFile: slug,
        lastModified: new Date().toISOString()
      },
      content: {
        title: title,
        summary: trimmedSection.substring(0, 200).replace(/[#*_\[\]!]/g, '').trim() + '...',
        fullContent: trimmedSection,
        url: `/publications/${slug}#pub-${itemCounter}`,
        links: links,
        journal: journal,
        year: year,
        hasPDF: hasPDF
      },
      subject: frontmatter.subjects ? {
        topics: frontmatter.subjects
      } : undefined,
      publication: frontmatter.publication ? {
        date: frontmatter.publication.date,
        publisher: frontmatter.publication.publisher,
        author: frontmatter.publication.author
      } : undefined,
      tags: frontmatter.subjects || frontmatter.tags || []
    };
    
    items.push(item);
    itemCounter++;
  }
  
  return items;
}

// Helper function to extract generic items from Warner background files
function extractWarnerBackgroundItems(fileData) {
  if (!fileData) return [];
  
  const { frontmatter, content, slug } = fileData;
  const items = [];
  
  // Split by section headers or significant breaks
  const sections = content.split(/(?=#{1,4}\s)|(?=\*{3,})/);
  
  let itemCounter = 1;
  
  for (const section of sections) {
    const trimmedSection = section.trim();
    if (trimmedSection.length < 150) continue; // Skip very short sections
    
    // Extract section title
    let title = 'Background Information';
    const titleMatches = [
      trimmedSection.match(/#{1,4}\s+(.+)/), // Markdown header
      trimmedSection.match(/\*\*(.*?)\*\*/), // Bold text
      trimmedSection.match(/^([^\n]+)/), // First line
    ];
    
    for (const match of titleMatches) {
      if (match && match[1] && match[1].trim().length > 3) {
        title = match[1].trim();
        break;
      }
    }
    
    // Extract links
    const linkMatches = trimmedSection.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
    const links = linkMatches.map(link => {
      const match = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
      return { text: match[1], url: match[2] };
    });
    
    // Create item
    const item = {
      metadata: {
        id: `${slug}-bg-${itemCounter}`,
        type: 'background',
        category: 'background',
        status: 'published',
        source: 'markdown-section',
        parentFile: slug,
        lastModified: new Date().toISOString()
      },
      content: {
        title: title,
        summary: trimmedSection.substring(0, 200).replace(/[#*_\[\]!]/g, '').trim() + '...',
        fullContent: trimmedSection,
        url: `/background/${slug}#bg-${itemCounter}`,
        links: links
      },
      subject: frontmatter.subjects ? {
        topics: frontmatter.subjects
      } : undefined,
      publication: frontmatter.publication ? {
        date: frontmatter.publication.date,
        publisher: frontmatter.publication.publisher,
        author: frontmatter.publication.author
      } : undefined,
      tags: frontmatter.subjects || frontmatter.tags || []
    };
    
    items.push(item);
    itemCounter++;
  }
  
  return items;
}

// Get all markdown files
const allFiles = fs.readdirSync(contentDir)
  .filter(file => file.endsWith('.md'))
  .map(file => path.join(contentDir, file));

console.log(`Found ${allFiles.length} markdown files`);

// Classification 1: Cheryl Interviews
const cherylInterviews = allFiles
  .filter(file => {
    const basename = path.basename(file);
    return basename.startsWith('c-') && 
           !basename.includes('reviews') && 
           !basename.includes('art') && 
           !basename.includes('articles');
  })
  .map(file => parseContent(file))
  .filter(data => data !== null)
  .map(data => createContentItem(data, 'interview', 'interviews'))
  .filter(item => item !== null);

// Classification 2: Cheryl Articles  
const cherylArticles = allFiles
  .filter(file => {
    const basename = path.basename(file);
    return basename.startsWith('c-') && 
           (basename.includes('art') || basename.includes('articles'));
  })
  .map(file => parseContent(file))
  .filter(data => data !== null)
  .map(data => createContentItem(data, 'article', 'articles'))
  .filter(item => item !== null);

// Classification 3: Cheryl Reviews
const cherylReviews = allFiles
  .filter(file => {
    const basename = path.basename(file);
    return basename.startsWith('c-') && basename.includes('reviews');
  })
  .map(file => parseContent(file))
  .filter(data => data !== null)
  .map(data => createContentItem(data, 'review', 'reviews'))
  .filter(item => item !== null);

// Classification 4: Warner Professional (table-based extraction)
const warnerProfessionalFiles = allFiles
  .filter(file => {
    const basename = path.basename(file);
    return basename.match(/^w-(projects|main)\.md$/);
  });

let warnerProfessional = [];
for (const file of warnerProfessionalFiles) {
  const fileData = parseContent(file);
  if (fileData) {
    const items = extractWarnerProfessionalItems(fileData);
    warnerProfessional = warnerProfessional.concat(items);
  }
}

// Also include individual project files
const warnerProjectFiles = allFiles
  .filter(file => {
    const basename = path.basename(file);
    return basename.startsWith('w-projects-');
  });

for (const file of warnerProjectFiles) {
  const fileData = parseContent(file);
  if (fileData) {
    const item = createContentItem(fileData, 'professional', 'professional');
    if (item) warnerProfessional.push(item);
  }
}

// Classification 5: Warner Publications (paragraph-based extraction)
const warnerPublicationFiles = allFiles
  .filter(file => {
    const basename = path.basename(file);
    return basename.match(/^w-pub\.md$/);
  });

let warnerPublications = [];
for (const file of warnerPublicationFiles) {
  const fileData = parseContent(file);
  if (fileData) {
    const items = extractWarnerPublicationItems(fileData);
    warnerPublications = warnerPublications.concat(items);
  }
}

// Also include individual publication files
const warnerPubFiles = allFiles
  .filter(file => {
    const basename = path.basename(file);
    return basename.startsWith('w-pub-');
  });

for (const file of warnerPubFiles) {
  const fileData = parseContent(file);
  if (fileData) {
    const item = createContentItem(fileData, 'publication', 'publications');
    if (item) warnerPublications.push(item);
  }
}

// Classification 6: Warner Background (section-based extraction)
const warnerBackgroundFiles = allFiles
  .filter(file => {
    const basename = path.basename(file);
    return basename.match(/^w-(background|northworks)\.md$/);
  });

let warnerBackground = [];
for (const file of warnerBackgroundFiles) {
  const fileData = parseContent(file);
  if (fileData) {
    const items = extractWarnerBackgroundItems(fileData);
    warnerBackground = warnerBackground.concat(items);
  }
}

// Also include any other Warner files not captured above
const otherWarnerFiles = allFiles
  .filter(file => {
    const basename = path.basename(file);
    return basename.startsWith('w-') && 
           !basename.includes('projects') && 
           !basename.includes('pub') &&
           !basename.match(/^w-(background|northworks|main)\.md$/);
  });

for (const file of otherWarnerFiles) {
  const fileData = parseContent(file);
  if (fileData) {
    const item = createContentItem(fileData, 'background', 'background');
    if (item) warnerBackground.push(item);
  }
}

// Create output directory
const dataDir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Generate JSON files for each classification
const classifications = [
  {
    name: 'cheryl-interviews',
    items: cherylInterviews,
    description: 'Classical music interviews with major figures'
  },
  {
    name: 'cheryl-articles', 
    items: cherylArticles,
    description: 'In-depth articles about classical music and performers'
  },
  {
    name: 'cheryl-reviews',
    items: cherylReviews, 
    description: 'Performance reviews of opera, symphony, and classical concerts'
  },
  {
    name: 'warner-professional',
    items: warnerProfessional,
    description: 'Professional experience, consulting projects, and career work'
  },
  {
    name: 'warner-publications',
    items: warnerPublications,
    description: 'Academic papers, research publications, and reports'
  },
  {
    name: 'warner-background',
    items: warnerBackground,
    description: 'Professional biography, education, and credentials'
  }
];

// Write each classification to its own JSON file
classifications.forEach(classification => {
  const outputFile = path.join(dataDir, `${classification.name}.json`);
  
  const outputData = {
    metadata: {
      classification: classification.name,
      description: classification.description,
      count: classification.items.length,
      generated: new Date().toISOString(),
      version: '1.0.0'
    },
    items: classification.items
  };
  
  fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));
  console.log(`✅ Generated ${outputFile} with ${classification.items.length} items`);
});

// Create a master index file
const masterIndex = {
  metadata: {
    title: 'NorthWorks Content Classifications',
    description: 'Master index of all content classifications for the NorthWorks website',
    generated: new Date().toISOString(),
    version: '1.0.0',
    totalItems: classifications.reduce((sum, c) => sum + c.items.length, 0)
  },
  classifications: classifications.map(c => ({
    name: c.name,
    description: c.description,
    count: c.items.length,
    file: `${c.name}.json`
  }))
};

fs.writeFileSync(
  path.join(dataDir, 'classifications-index.json'), 
  JSON.stringify(masterIndex, null, 2)
);

console.log(`\n✅ Generated master index with ${masterIndex.metadata.totalItems} total items`);
console.log('\n📊 Classification Summary:');
classifications.forEach(c => {
  console.log(`   ${c.name}: ${c.items.length} items`);
});
