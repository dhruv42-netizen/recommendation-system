# 🎯 Recommendation System Backend

A Node.js + Express backend that suggests **products, videos, and content** based on user behavior using **cosine similarity algorithms**.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Algorithm:** Cosine Similarity (tag-based)

## How It Works

The system uses **Cosine Similarity** to compare user interests/behavior with available items. Each product and video has tags. The algorithm finds items whose tags are most similar to what the user has already viewed or liked.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Server
```bash
npm start
# or for development:
npm run dev
```

## API Endpoints

### `POST /recommend/products`
Get product recommendations based on viewed products or interests.

**Request Body:**
```json
{
  "viewedProductIds": [1, 3],
  "interests": ["fitness", "wireless"]
}
```

**Response:**
```json
{
  "recommendations": [
    { "id": 7, "name": "Smart Watch", "score": 0.89 },
    ...
  ]
}
```

---

### `POST /recommend/videos`
Get video recommendations based on watched videos or interests.

**Request Body:**
```json
{
  "watchedVideoIds": [1],
  "interests": ["javascript", "backend"]
}
```

---

### `GET /recommend/similar/product/:id`
Find products similar to a specific product.

**Example:** `GET /recommend/similar/product/1`

---

### `GET /products`
List all available products.

### `GET /videos`
List all available videos.

## Project Structure
```
recommendation-system/
├── src/
│   └── index.js       # Main Express server + recommendation logic
├── package.json
├── .gitignore
└── README.md
```

## Algorithm

**Cosine Similarity** measures the angle between two tag vectors:
- Score of **1.0** = identical tags (perfect match)
- Score of **0.0** = no common tags (no match)

Results are sorted by score and top 5 are returned.
