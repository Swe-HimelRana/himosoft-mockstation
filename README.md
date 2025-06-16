# Himosoft MockStation 🚀



🌐 **Live App**: [https://mockstation.himosoft.com.bd](https://mockstation.himosoft.com.bd)

## Features ✨

- 🎯 **Instant API Creation**: Create mock APIs in seconds
- 🔐 **API Key Authentication**: Secure your endpoints with API keys
- 📊 **Pagination Support**: Built-in pagination for list endpoints
- 🌐 **Public & Private Endpoints**: Mix of public and authenticated endpoints
- 🎨 **Modern UI**: Beautiful and intuitive user interface
- 📝 **Detailed Documentation**: Auto-generated API documentation
- 🔄 **Real-time Updates**: Instant feedback on API changes

## Getting Started 🚀

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/swe-himelrana/himosoft-mockstation.git
cd himosoft-mockstation
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage 📖

1. Visit the homepage and create a new API instance
2. Copy your API key from the generated documentation
3. Use the provided endpoints to test your application

### Example API Usage

```bash
# Get all items (public endpoint)
curl "http://localhost:3000/api/public/items/YOUR_INSTANCE_ID?page=1&limit=5"

# Create an item (authenticated endpoint)
curl -X POST "http://localhost:3000/api/items/YOUR_INSTANCE_ID" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"name": "Example Item", "description": "This is an example item"}'
```

## API Endpoints 🌐

### Public Endpoints

- `GET /api/public/items/[id]` - Get all items (paginated)

### Authenticated Endpoints

- `GET /api/items/[id]` - Get all items (paginated)
- `POST /api/items/[id]` - Create a new item
- `GET /api/items/[id]/[itemId]` - Get a specific item
- `PUT /api/items/[id]/[itemId]` - Update an item
- `DELETE /api/items/[id]/[itemId]` - Delete an item

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide Icons](https://lucide.dev/) 
- Database with [LowDB](https://github.com/typicode/lowdb)
