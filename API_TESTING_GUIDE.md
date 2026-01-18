# API Testing Quick Reference

Use these curl commands to test your API endpoints:

## Test the Example Endpoint
```bash
curl http://localhost:3000/api/v1/example
```

## Authors Endpoints

### Get all authors
```bash
curl http://localhost:3000/api/v1/authors
```

### Get a specific author
```bash
curl http://localhost:3000/api/v1/authors/1
```

### Create a new author
```bash
curl -X POST http://localhost:3000/api/v1/authors \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Cooper","email":"alice@example.com"}'
```

### Update an author
```bash
curl -X PUT http://localhost:3000/api/v1/authors/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Updated","email":"john.updated@example.com"}'
```

### Delete an author (without articles)
```bash
curl -X DELETE http://localhost:3000/api/v1/authors/3
```

### Try to delete an author with articles (should fail)
```bash
curl -X DELETE http://localhost:3000/api/v1/authors/1
# Expected: 400 error - "Cannot delete author with existing articles"
```

## Articles Endpoints

### Get all articles (with author info)
```bash
curl http://localhost:3000/api/v1/articles
```

### Get a specific article (with author info)
```bash
curl http://localhost:3000/api/v1/articles/1
```

### Get articles by a specific author
```bash
curl http://localhost:3000/api/v1/articles/author/1
```

### Create a new article
```bash
curl -X POST http://localhost:3000/api/v1/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"My New Article","description":"This is a great article","author_id":1}'
```

### Update an article (by the author)
```bash
curl -X PUT http://localhost:3000/api/v1/articles/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Article Title","author_id":1}'
```

### Try to update an article by wrong author (should fail)
```bash
curl -X PUT http://localhost:3000/api/v1/articles/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Unauthorized Update","author_id":2}'
# Expected: 404 error - "Article not found or you are not the author"
```

### Delete an article (by the author)
```bash
curl -X DELETE http://localhost:3000/api/v1/articles/1 \
  -H "Content-Type: application/json" \
  -d '{"author_id":1}'
```

### Try to delete an article by wrong author (should fail)
```bash
curl -X DELETE http://localhost:3000/api/v1/articles/2 \
  -H "Content-Type: application/json" \
  -d '{"author_id":1}'
# Expected: 404 error - "Article not found or you are not the author"
```

## Test Scenarios

### Scenario 1: Create author and article workflow
```bash
# 1. Create a new author
curl -X POST http://localhost:3000/api/v1/authors \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"testuser@example.com"}'
# Note the returned ID (e.g., 4)

# 2. Create an article for that author
curl -X POST http://localhost:3000/api/v1/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Article","description":"Testing workflow","author_id":4}'

# 3. Verify the article appears with author info
curl http://localhost:3000/api/v1/articles/author/4
```

### Scenario 2: Test foreign key constraint
```bash
# 1. Try to create an article with non-existent author
curl -X POST http://localhost:3000/api/v1/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"Invalid Article","description":"No author","author_id":999}'
# Expected: 404 error - "Author not found"
```

### Scenario 3: Test email uniqueness
```bash
# Try to create an author with existing email
curl -X POST http://localhost:3000/api/v1/authors \
  -H "Content-Type: application/json" \
  -d '{"name":"Duplicate Email","email":"john.doe@example.com"}'
# Expected: 400 error - "Email already exists"
```

## Using HTTPie (alternative to curl)

If you have HTTPie installed (`brew install httpie`):

```bash
# GET request
http localhost:3000/api/v1/articles

# POST request
http POST localhost:3000/api/v1/authors name="New Author" email="new@example.com"

# PUT request
http PUT localhost:3000/api/v1/articles/1 title="Updated" author_id:=1

# DELETE request
http DELETE localhost:3000/api/v1/articles/1 author_id:=1
```

## Using Postman or Insomnia

1. Import the base URL: `http://localhost:3000`
2. Create requests for each endpoint
3. Set Content-Type header to `application/json`
4. Use the JSON bodies shown above

---

## Quick Test All Features

Run this script to test all features:

```bash
#!/bin/bash

echo "Testing API..."

echo "\n1. Get all authors"
curl http://localhost:3000/api/v1/authors

echo "\n\n2. Get all articles with author info"
curl http://localhost:3000/api/v1/articles

echo "\n\n3. Create new author"
curl -X POST http://localhost:3000/api/v1/authors \
  -H "Content-Type: application/json" \
  -d '{"name":"API Test","email":"apitest@example.com"}'

echo "\n\n4. Create article for author 1"
curl -X POST http://localhost:3000/api/v1/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"API Test Article","description":"Testing","author_id":1}'

echo "\n\nAll tests completed!"
```

Save this as `test-api.sh`, make it executable (`chmod +x test-api.sh`), and run it (`./test-api.sh`).
