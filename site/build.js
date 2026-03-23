const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

// Configuration
const CONTENT_DIR = path.join(__dirname, '..', 'content');
const TEMPLATES_DIR = path.join(__dirname, 'templates');
const OUTPUT_DIR = path.join(__dirname, 'dist');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// HTML Template
const pageTemplate = (title, content, brand = null) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} — Agency Content Hub</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
        }
        .header h1 { font-size: 1.8rem; }
        .header p { opacity: 0.9; margin-top: 0.5rem; }
        .nav {
            background: white;
            padding: 1rem 2rem;
            border-bottom: 1px solid #e5e7eb;
        }
        .nav a {
            color: #667eea;
            text-decoration: none;
            margin-right: 1.5rem;
            font-weight: 500;
        }
        .nav a:hover { text-decoration: underline; }
        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
        }
        .content {
            background: white;
            padding: 3rem;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .content h1 {
            color: #1f2937;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #667eea;
        }
        .content h2 {
            color: #374151;
            margin: 2rem 0 1rem;
        }
        .content h3 {
            color: #4b5563;
            margin: 1.5rem 0 0.75rem;
        }
        .content p {
            margin-bottom: 1rem;
            color: #4b5563;
        }
        .content ul, .content ol {
            margin: 1rem 0 1rem 1.5rem;
        }
        .content li {
            margin-bottom: 0.5rem;
        }
        .content table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
        }
        .content th, .content td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        .content th {
            background: #f9fafb;
            font-weight: 600;
            color: #374151;
        }
        .meta {
            background: #f3f4f6;
            padding: 1rem;
            border-radius: 6px;
            margin-bottom: 2rem;
            font-size: 0.9rem;
        }
        .meta span {
            margin-right: 1rem;
            color: #6b7280;
        }
        .brand-maison { border-left: 4px solid #B9B07D; }
        .brand-maui { border-left: 4px solid #00A8A8; }
        footer {
            text-align: center;
            padding: 2rem;
            color: #9ca3af;
            margin-top: 3rem;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏢 Agency Content Hub</h1>
        <p>Brand intelligence, content strategy, and creative direction</p>
    </div>
    <nav class="nav">
        <a href="/">Home</a>
        <a href="/maison-albion/">Maison Albion</a>
        <a href="/maui-pineapple-chapel/">Maui Pineapple Chapel</a>
    </nav>
    <div class="container">
        <div class="content ${brand ? 'brand-' + brand : ''}">
            ${content}
        </div>
    </div>
    <footer>
        <p>Agency Content Hub — Updated March 2026</p>
    </footer>
</body>
</html>`;

// Index page template
const indexTemplate = (brandList, recentContent) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agency Content Hub</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 3rem 2rem;
            text-align: center;
        }
        .header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .header p { font-size: 1.1rem; opacity: 0.9; }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 2rem;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }
        .card {
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: transform 0.2s;
            text-decoration: none;
            color: inherit;
        }
        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .card h2 {
            color: #667eea;
            margin-bottom: 0.5rem;
        }
        .card p {
            color: #6b7280;
            font-size: 0.95rem;
        }
        .maison { border-left: 4px solid #B9B07D; }
        .maui { border-left: 4px solid #00A8A8; }
        .section-title {
            font-size: 1.5rem;
            color: #374151;
            margin: 2rem 0 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #e5e7eb;
        }
        footer {
            text-align: center;
            padding: 2rem;
            color: #9ca3af;
            margin-top: 3rem;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏢 Agency Content Hub</h1>
        <p>Brand intelligence, content strategy, and creative direction</p>
    </div>
    <div class="container">
        <h2 class="section-title">Brands</h2>
        <div class="grid">
            ${brandList.map(b => `
            <a href="/${b.slug}/" class="card ${b.slug}">
                <h2>${b.name}</h2>
                <p>${b.description}</p>
            </a>
            `).join('')}
        </div>
        
        <h2 class="section-title">Recent Content</h2>
        <div class="grid">
            ${recentContent.map(c => `
            <a href="${c.url}" class="card ${c.brand}">
                <h3>${c.title}</h3>
                <p>${c.type} · ${c.date}</p>
            </a>
            `).join('')}
        </div>
    </div>
    <footer>
        <p>Agency Content Hub — Updated March 2026</p>
    </footer>
</body>
</html>`;

// Process content files
function processContent() {
  const brands = [];
  const allContent = [];

  // Read content directory
  const entries = fs.readdirSync(CONTENT_DIR);
  
  for (const entry of entries) {
    const entryPath = path.join(CONTENT_DIR, entry);
    const stat = fs.statSync(entryPath);
    
    if (stat.isDirectory() && !entry.startsWith('_')) {
      // This is a brand directory
      const brandSlug = entry;
      const brandOutputDir = path.join(OUTPUT_DIR, brandSlug);
      fs.mkdirSync(brandOutputDir, { recursive: true });
      
      // Read brand content files
      const files = fs.readdirSync(entryPath).filter(f => f.endsWith('.md'));
      const brandContent = [];
      
      for (const file of files) {
        const filePath = path.join(entryPath, file);
        const raw = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(raw);
        
        const html = marked(content);
        const outputFile = file.replace('.md', '.html');
        const outputPath = path.join(brandOutputDir, outputFile);
        
        // Add meta information
        const metaHtml = `
<div class="meta">
  <span>📅 ${data.date || 'No date'}</span>
  <span>🏷️ ${(data.tags || []).join(', ') || 'No tags'}</span>
  <span>👥 ${(data.audience || []).join(', ') || 'All'}</span>
</div>
`;
        
        const fullHtml = pageTemplate(data.title, metaHtml + html, brandSlug);
        fs.writeFileSync(outputPath, fullHtml);
        
        brandContent.push({
          title: data.title,
          type: data.type,
          date: data.date,
          url: `/${brandSlug}/${outputFile}`,
          brand: brandSlug
        });
        
        allContent.push({
          title: data.title,
          type: data.type,
          date: data.date,
          url: `/${brandSlug}/${outputFile}`,
          brand: brandSlug
        });
      }
      
      // Create brand index
      const brandName = brandSlug === 'maison-albion' ? '🏛️ Maison Albion' : 
                        brandSlug === 'maui-pineapple-chapel' ? '🍍 Maui Pineapple Chapel' : 
                        brandSlug;
      
      brands.push({
        slug: brandSlug,
        name: brandName,
        description: brandSlug === 'maison-albion' ? '1878 French Mansard wedding venue in Upstate NY' :
                     brandSlug === 'maui-pineapple-chapel' ? 'Tropical wedding chapel in Maui, Hawaii' :
                     'Brand description'
      });
    }
  }
  
  // Sort content by date (newest first)
  allContent.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Create main index
  const indexHtml = indexTemplate(brands, allContent.slice(0, 6));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHtml);
  
  console.log(`✅ Built ${allContent.length} content pages`);
  console.log(`✅ Generated index at ${OUTPUT_DIR}/index.html`);
}

// Run build
processContent();
