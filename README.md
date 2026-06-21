# Shopping Negotiator

## Overview
Shopping Negotiator is an AI-powered shopping assistant designed to find the best deal across multiple shopping websites using both text and image inputs. It evaluates total cost including hidden charges, seller rating, and delivery quality to recommend the best option.

## Key Features
- Text search for product queries
- Image search for product matching
- Best deal ranking using lowest total cost, ratings, and delivery
- Six filter options for refined results
- Multi-website comparison
- API testing support via Swagger and Postman

## Tech Stack
- Frontend: Angular
- Backend: NestJS
- AI/Processing: Python
- Database: PostgreSQL
- API Testing: Swagger / Postman

## Filters
The application supports six filters that help users narrow results by relevant criteria. Example filters may include:
1. Price range
2. Category or product type
3. Seller rating
4. Delivery speed or service
5. Shipping cost / hidden charges
6. Brand or retailer

## Best Deal Logic
The best deal is calculated using:
- Lowest total cost including hidden charges
- Seller rating or review score
- Delivery quality and speed

This ensures recommendations are not just cheapest, but also reliable and convenient.

## Architecture
1. Angular frontend sends search requests with text or image input.
2. NestJS API receives requests and routes them to Python services.
3. Python modules perform product matching, price normalization, and deal scoring.
4. PostgreSQL stores product data, price history, user preferences, and tracking metadata.
5. The API returns the top-ranked best deals to the frontend.

## Getting Started
1. Clone the repository.
2. Install dependencies for each layer:
   - Angular frontend: `npm install`
   - NestJS backend: `npm install`
   - Python services: `pip install -r requirements.txt`
3. Configure PostgreSQL database credentials in backend environment settings.
4. Run database migrations.
5. Start the backend and frontend servers.

## API Testing
- Use Swagger for interactive API documentation and endpoint testing.
- Use Postman for request automation and collection testing.

## Notes
- Initial feature set focuses on text and image-based best deal search.
- Future enhancements can include user accounts, price alerts, historical analytics, and additional marketplaces.
