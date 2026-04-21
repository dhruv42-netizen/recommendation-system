const express = require('express');
const app = express();
app.use(express.json());

// Sample data - in real app this would come from a database
const products = [
  { id: 1, name: 'Wireless Headphones', category: 'electronics', tags: ['audio', 'wireless', 'music'] },
  { id: 2, name: 'Running Shoes', category: 'sports', tags: ['running', 'fitness', 'outdoor'] },
  { id: 3, name: 'JavaScript Book', category: 'books', tags: ['programming', 'javascript', 'learning'] },
  { id: 4, name: 'Yoga Mat', category: 'sports', tags: ['yoga', 'fitness', 'wellness'] },
  { id: 5, name: 'Bluetooth Speaker', category: 'electronics', tags: ['audio', 'wireless', 'music'] },
  { id: 6, name: 'Python Book', category: 'books', tags: ['programming', 'python', 'learning'] },
  { id: 7, name: 'Smart Watch', category: 'electronics', tags: ['fitness', 'wireless', 'wearable'] },
  { id: 8, name: 'Resistance Bands', category: 'sports', tags: ['fitness', 'workout', 'wellness'] },
];

const videos = [
  { id: 1, title: 'Intro to Node.js', category: 'programming', tags: ['nodejs', 'javascript', 'backend'] },
  { id: 2, title: 'Full Body Workout', category: 'fitness', tags: ['workout', 'fitness', 'health'] },
  { id: 3, title: 'React for Beginners', category: 'programming', tags: ['react', 'javascript', 'frontend'] },
  { id: 4, title: 'Meditation Guide', category: 'wellness', tags: ['meditation', 'wellness', 'mindfulness'] },
  { id: 5, title: 'Express.js Crash Course', category: 'programming', tags: ['nodejs', 'express', 'backend'] },
  { id: 6, title: 'Yoga for Beginners', category: 'fitness', tags: ['yoga', 'wellness', 'fitness'] },
];

// Cosine similarity function for tag-based recommendations
function cosineSimilarity(tagsA, tagsB) {
  const allTags = [...new Set([...tagsA, ...tagsB])];
  const vectorA = allTags.map(tag => tagsA.includes(tag) ? 1 : 0);
  const vectorB = allTags.map(tag => tagsB.includes(tag) ? 1 : 0);

  const dotProduct = vectorA.reduce((sum, val, i) => sum + val * vectorB[i], 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, val) => sum + val * val, 0));

  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
}

// POST /recommend/products - Recommend products based on user behavior
app.post('/recommend/products', (req, res) => {
  const { viewedProductIds = [], interests = [] } = req.body;

  if (!viewedProductIds.length && !interests.length) {
    return res.status(400).json({ error: 'Provide viewedProductIds or interests' });
  }

  // Get tags from viewed products
  const viewedTags = viewedProductIds.flatMap(id => {
    const product = products.find(p => p.id === id);
    return product ? product.tags : [];
  });

  const combinedTags = [...new Set([...viewedTags, ...interests])];

  // Score all products not already viewed
  const recommendations = products
    .filter(p => !viewedProductIds.includes(p.id))
    .map(p => ({
      ...p,
      score: cosineSimilarity(combinedTags, p.tags),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  res.json({ recommendations });
});

// POST /recommend/videos - Recommend videos based on user behavior
app.post('/recommend/videos', (req, res) => {
  const { watchedVideoIds = [], interests = [] } = req.body;

  if (!watchedVideoIds.length && !interests.length) {
    return res.status(400).json({ error: 'Provide watchedVideoIds or interests' });
  }

  const watchedTags = watchedVideoIds.flatMap(id => {
    const video = videos.find(v => v.id === id);
    return video ? video.tags : [];
  });

  const combinedTags = [...new Set([...watchedTags, ...interests])];

  const recommendations = videos
    .filter(v => !watchedVideoIds.includes(v.id))
    .map(v => ({
      ...v,
      score: cosineSimilarity(combinedTags, v.tags),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  res.json({ recommendations });
});

// GET /recommend/similar/product/:id - Find similar products
app.get('/recommend/similar/product/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const similar = products
    .filter(p => p.id !== productId)
    .map(p => ({
      ...p,
      score: cosineSimilarity(product.tags, p.tags),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  res.json({ product, similar });
});

// GET /products - List all products
app.get('/products', (req, res) => res.json({ products }));

// GET /videos - List all videos
app.get('/videos', (req, res) => res.json({ videos }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Recommendation System running on port ${PORT}`));
