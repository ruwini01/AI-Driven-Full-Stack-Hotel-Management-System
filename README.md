# LuxStay - AI-Driven Full-Stack Hotel Management System

An intelligent, full-stack hotel management platform that leverages AI to revolutionize the hospitality industry with seamless booking experiences, smart recommendations, and efficient operations management.

**Live Demo:** [https://ai-driven-full-stack-hotel-manageme.vercel.app](https://ai-driven-full-stack-hotel-manageme.vercel.app)


## Overview

LuxStay is a modern, AI-powered hotel management system designed to streamline hotel operations and enhance guest experiences. Built with cutting-edge technologies, it provides a comprehensive solution for hotel bookings, room management, guest services, and administrative operations.

### Why LuxStay?

- **AI-Powered Intelligence**: Smart recommendations, predictive analytics, and automated customer service
- **Real-time Updates**: Live availability tracking and instant booking confirmations
- **Responsive Design**: Seamless experience across all devices
- **Scalable Architecture**: Built to handle hotels of any size
- **Secure & Reliable**: Industry-standard security practices and robust error handling

---

## Features

### For Guests

- **Smart Room Search**: AI-powered search with filters for room type, price, amenities, and availability
- **Real-time Booking**: Instant booking confirmation with live availability updates
- **Secure Payments**: Multiple payment gateways with PCI compliance
- **Mobile Responsive**: Full functionality on smartphones and tablets
- **Reviews & Ratings**: Read and write authentic guest reviews
- **Personalized Recommendations**: AI-driven suggestions based on preferences and history

### For Hotel Staff

- **Dashboard Analytics**: Real-time insights into bookings, revenue, and occupancy
- **Room Management**: Add, edit, and manage room inventory
- **Booking Management**: View, modify, and cancel reservations
- **Guest Management**: Access guest information and booking history
- **Revenue Tracking**: Monitor income streams and financial metrics
- **Reports & Analytics**: Generate detailed business reports

---

## Tech Stack

### Frontend

- **Framework**: React.js
- **Language**: JavaScript, TypeScript
- **Styling**: CSS3, Tailwind CSS
- **State Management**: Redux
- **UI Components**: Custom components with responsive design
- **Form Handling**: React Hook Form
- **HTTP Client**: Fetch API

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript / TypeScript
- **API Architecture**: RESTful API
- **Authentication**: Clerk
- **Validation**: Joi / Express Validator

### Database

- **Primary Database**: MongoDB
- **ORM/ODM**: Mongoose

### AI & Machine Learning

- **AI Integration**: OpenAI API
- **Recommendation Engine**: Collaborative filtering algorithms
- **Predictive Analytics**: Time series forecasting for demand prediction(Future Work)

### DevOps & Deployment

- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway
- **Database Hosting**: MongoDB Atlas
- **Version Control**: Git & GitHub
- **CI/CD**: GitHub Actions

### Development Tools

- **Package Manager**: npm
- **Code Quality**: Prettier
- **API Testing**: Postman

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.x or higher)
- **npm** package manager
- **MongoDB** database
- **Git** for version control

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/ruwini01/AI-Driven-Full-Stack-Hotel-Management-System.git
cd AI-Driven-Full-Stack-Hotel-Management-System
```

#### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

#### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Environment Variables

#### Backend `.env` Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/luxstay

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here

# AI Services
OPENAI_API_KEY=your_openai_api_key
AI_MODEL=gpt-4

# Payment Gateway
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

#### Frontend `.env` Configuration

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
```

### Running the Application

#### Start Backend Server

```bash
cd backend
npm run dev
```

#### Start Frontend Application

```bash
cd frontend
npm start
```


## Usage

### For Guests

1. **Browse Rooms**: Navigate to the home page and explore available rooms
2. **Search & Filter**: Use the search bar and filters to find your perfect room
3. **View Details**: Click on any room to see detailed information, photos, and amenities
4. **Make a Booking**: Select dates, number of guests, and proceed to checkout
5. **AI Assistant**: Chat with the AI bot for recommendations and support

### For Hotel Staff

1. **Login**: Access the admin panel with your credentials
2. **Dashboard**: View real-time analytics and recent bookings
3. **Manage Rooms**: Add, edit, or remove room listings
4. **Handle Bookings**: Process check-ins, check-outs, and modifications
5. **Generate Reports**: Create custom reports for business insights

---

## Deployment

### Frontend Deployment (Vercel)

#### 1. Connect Repository
- Log in to [Vercel](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Select the `frontend` directory as the root

#### 2. Configure Build Settings
```
Framework Preset: Next.js / Create React App
Build Command: npm run build
Output Directory: build / .next / out
Install Command: npm install
```

#### 3. Set Environment Variables
Add the following environment variables in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
NEXT_PUBLIC_AI_ENABLED=true
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

#### 4. Deploy
- Click "Deploy"
- Vercel will automatically build and deploy your application
- You'll receive a production URL

### Backend Deployment (Railway)

#### 1. Create New Project
- Log in to [Railway](https://railway.app)
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository

#### 2. Configure Settings
```
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

#### 3. Add Environment Variables
Add all backend environment variables:
```
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_production_jwt_secret
OPENAI_API_KEY=your_openai_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

#### 4. Deploy
- Railway will automatically deploy your backend
- Note the provided URL for frontend configuration


### Database Deployment

#### MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Configure network access (allow access from anywhere for production)
4. Create database user
5. Get connection string
6. Update `MONGODB_URI` in your backend environment variables

#### Supabase (for PostgreSQL)
1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Note your database credentials
4. Update `DATABASE_URL` in your backend environment variables

---

## Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

#### 1. Fork the Repository
```bash
git clone https://github.com/YOUR_USERNAME/AI-Driven-Full-Stack-Hotel-Management-System.git
cd AI-Driven-Full-Stack-Hotel-Management-System
```

#### 2. Create a Feature Branch
```bash
git checkout -b feature/amazing-feature
```

#### 3. Make Your Changes
- Write clean, documented code
- Follow the existing code style
- Add tests if applicable
- Update documentation as needed

#### 4. Commit Your Changes
```bash
git add .
git commit -m 'Add some amazing feature'
```

Follow conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

#### 5. Push to Branch
```bash
git push origin feature/amazing-feature
```

#### 6. Open a Pull Request
- Go to the original repository
- Click "New Pull Request"
- Provide a clear description of changes
- Reference any related issues
- Wait for review

### Code Style Guidelines

#### JavaScript/TypeScript
- Use ES6+ features
- Use meaningful variable and function names
- Write comments for complex logic
- Follow ESLint and Prettier configurations
- Use async/await for asynchronous operations
- Handle errors properly with try-catch blocks

#### React Components
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use PropTypes or TypeScript for type checking
- Follow component naming conventions (PascalCase)

#### API Endpoints
- Use RESTful conventions
- Include proper error handling
- Validate input data
- Return appropriate HTTP status codes
- Document all endpoints

### Testing

Before submitting a pull request:

#### Run Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

#### Run Linting
```bash
npm run lint
```

#### Check Code Formatting
```bash
npm run format:check
```

### Reporting Bugs

If you find a bug, please create an issue with:

1. **Clear Title**: Brief description of the issue
2. **Description**: Detailed explanation of the problem
3. **Steps to Reproduce**: 
   - Step 1
   - Step 2
   - Step 3
4. **Expected Behavior**: What should happen
5. **Actual Behavior**: What actually happens
6. **Environment**:
   - OS: [e.g., Windows 10, macOS 12.0]
   - Browser: [e.g., Chrome 96, Firefox 94]
   - Node Version: [e.g., 16.13.0]
7. **Additional Context**: Any other relevant information

### Suggesting Features

For feature requests, please include:

1. **Problem Statement**: What problem does this feature solve?
2. **Proposed Solution**: How should the feature work?
3. **Alternatives Considered**: Other approaches you've thought about
4. **Additional Context**: Any other relevant information

---

## Contact

**Developer**: Ruwini

- **GitHub**: [@ruwini01](https://github.com/ruwini01)
- **Repository**: [AI-Driven-Full-Stack-Hotel-Management-System](https://github.com/ruwini01/AI-Driven-Full-Stack-Hotel-Management-System)
- **Live Demo**: [https://ai-driven-full-stack-hotel-manageme.vercel.app](https://ai-driven-full-stack-hotel-manageme.vercel.app)

For questions, suggestions, or collaboration opportunities, please open an issue on GitHub or contact through the repository.

---

## Acknowledgments

- **OpenAI** for providing AI/ML capabilities
- **Vercel** for seamless frontend deployment
- **MongoDB Atlas** for database hosting
- **Railway** for backend hosting
- **React Community** for amazing libraries and tools
- **Node.js Community** for robust backend frameworks
- All contributors and supporters of this project

---

## Roadmap

### Version 1.0.0 (Current)
- ✅ User authentication and authorization
- ✅ Room browsing and search
- ✅ Booking system
- ✅ Payment integration
- ✅ Admin dashboard
- ✅ Responsive design

### Version 1.1.0 (Planned)
- [ ] Multi-language support (i18n)
- [ ] Email notification system
- [ ] SMS notifications
- [ ] Advanced filtering options
- [ ] Wish list functionality
- [ ] Special offers and discounts
- [ ] Newsletter subscription

### Version 2.0.0 (Future)
- [ ] Mobile app (React Native)
- [ ] Virtual room tours (360° view)
- [ ] AR/VR integration
- [ ] Loyalty program system
- [ ] Group booking management
- [ ] Integration with hotel management hardware
- [ ] Advanced analytics dashboard
- [ ] Automated check-in/check-out kiosks

### Version 3.0.0 (Long-term)
- [ ] Multi-property management
- [ ] Franchise support
- [ ] Advanced revenue management
- [ ] Integration with OTAs (Booking.com, Expedia)
- [ ] Channel manager
- [ ] CRM system integration
- [ ] Social media integration
- [ ] Advanced reporting tools

---

## Project Statistics

- **Language Composition**:
  - JavaScript: 78.9%
  - TypeScript: 19.4%
  - CSS: 1.4%
  - HTML: 0.3%

- **Total Commits**: 97+
- **Repository Size**: Active development
- **License**: MIT
- **Status**: Active development

---

## Support

If you find this project helpful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs and issues
- 💡 Suggesting new features
- 🤝 Contributing to the codebase
- 📢 Sharing with others who might benefit
- 📝 Improving documentation
- 💬 Joining discussions

---

<div align="center">

**Made with ❤️ by [Ruwini](https://github.com/ruwini01)**

**LuxStay - Redefining Hospitality with AI**

[⬆ Back to Top](#luxstay---ai-driven-full-stack-hotel-management-system)

<img width="940" height="435" alt="luxstay" src="https://github.com/user-attachments/assets/b6b05f31-3f8e-4b5c-a91b-6fba08b17ddd" />


</div>
