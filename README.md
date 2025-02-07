# CS Quiz Application Frontend

A modern React-based frontend for an interactive computer science quiz application.

## Features

- User authentication (login/register)
- Interactive quiz taking interface
- Real-time quiz progress tracking
- PDF export functionality for quiz results
- Admin dashboard for quiz management
- Topic-based quiz organization
- Leaderboard system
- Responsive design for all devices
- Material-UI based modern interface

## Tech Stack

- React 19.0.0
- Material-UI (MUI) 6.4.3
- React Router DOM 7.1.5
- Axios for API communication
- Framer Motion for animations
- PDF generation with @react-pdf/renderer
- Date handling with date-fns

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with:
```
REACT_APP_API_URL=http://localhost:5000/api/v1
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the development server
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from create-react-app

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── admin/         # Admin-specific components
│   ├── common/        # Shared components
│   └── quiz/          # Quiz-related components
├── context/           # React context providers
├── pages/             # Page components
├── services/          # API services
├── utils/             # Utility functions
└── App.js             # Root component
```

## Features in Detail

### Quiz Taking
- Interactive quiz interface with timer
- Multiple choice questions
- Real-time progress tracking
- Immediate feedback after submission

### Admin Features
- Quiz creation and management
- Topic management
- User management
- Analytics dashboard
- Quiz performance tracking

### User Features
- Profile management
- Quiz history
- Performance statistics
- Achievement tracking
- Leaderboard participation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request