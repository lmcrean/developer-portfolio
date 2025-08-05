# GitHub Pull Request Habit Tracker

A robust backend service that tracks and visualizes the number of pull requests made by a user per day, designed to build habit tracking for developer productivity.

## Architecture Overview

The habit tracker is built with a modular architecture consisting of:

- **Database Layer** (`database.ts`): SQLite database operations with planned migration to NeonDB/PostgreSQL
- **GitHub Integration** (`github-sync.ts`): Efficient GitHub API integration with rate limiting and caching
- **API Layer** (`index.ts`): RESTful endpoints for data refresh and retrieval
- **Type Definitions** (`types.ts`): TypeScript interfaces for type safety

## Features

- **Efficient Data Storage**: Uses SQLite for local development with plans for PostgreSQL production
- **Rate Limit Aware**: Minimizes GitHub API calls through smart caching and data persistence
- **Comprehensive Statistics**: Tracks streaks, averages, and detailed analytics
- **Robust Error Handling**: Graceful handling of API failures and network issues
- **RESTful API**: Clean endpoints for frontend integration

## Database Schema

The system uses a simple but effective schema:

```sql
CREATE TABLE pull_request_habits (
  date TEXT PRIMARY KEY,              -- YYYY-MM-DD format
  pull_request_count INTEGER NOT NULL,
  last_updated TEXT NOT NULL         -- ISO 8601 timestamp
);
```

## API Endpoints

### POST `/api/github/habit-tracker/refresh`

Triggers a refresh of pull request data from GitHub.

**Request Body** (optional):
```json
{
  "date_range": {
    "start_date": "2025-01-01",
    "end_date": "2025-01-31"
  }
}
```

**Response**:
```json
{
  "success": true,
  "result": {
    "days_updated": 31,
    "total_pull_requests_found": 45,
    "date_range": {
      "start_date": "2025-01-01",
      "end_date": "2025-01-31"
    }
  }
}
```

### GET `/api/github/habit-tracker/entries`

Retrieves habit data for a date range.

**Query Parameters**:
- `start_date` (optional): Start date in YYYY-MM-DD format (defaults to 30 days ago)
- `end_date` (optional): End date in YYYY-MM-DD format (defaults to today)

**Response**:
```json
{
  "entries": [
    {
      "date": "2025-01-15",
      "pull_request_count": 3,
      "last_updated": "2025-01-15T10:30:00Z"
    }
  ],
  "date_range": {
    "start_date": "2025-01-01",
    "end_date": "2025-01-31"
  }
}
```

### GET `/api/github/habit-tracker/entries/:date`

Retrieves habit data for a specific date.

**Response**:
```json
{
  "date": "2025-01-15",
  "pull_request_count": 3,
  "last_updated": "2025-01-15T10:30:00Z"
}
```

### GET `/api/github/habit-tracker/stats`

Retrieves overall statistics and analytics.

**Response**:
```json
{
  "total_days": 180,
  "total_pull_requests": 342,
  "average_per_day": 1.9,
  "max_in_single_day": 8,
  "current_streak": 5,
  "longest_streak": 12
}
```

## Environment Configuration

### Required Environment Variables

```bash
# GitHub API access
GITHUB_TOKEN=your_github_token_here
GITHUB_USERNAME=your_username_here

# Database (optional, defaults to ./data/habit-tracker.db)
HABIT_TRACKER_DB_PATH=/path/to/database.db
```

### Development Setup

1. **Install Dependencies**:
   ```bash
   cd apps/api/github
   npm install
   ```

2. **Set Environment Variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your GitHub token and username
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Test the API**:
   ```bash
   # Refresh data
   curl -X POST http://localhost:3000/api/github/habit-tracker/refresh

   # Get recent entries
   curl http://localhost:3000/api/github/habit-tracker/entries

   # Get statistics
   curl http://localhost:3000/api/github/habit-tracker/stats
   ```

## Production Deployment

### Phase 1: SQLite (Current)
- Database stored as file in `./data/habit-tracker.db`
- Suitable for single-instance deployments
- Automatic directory creation and initialization

### Phase 2: PostgreSQL Migration (Planned)
- Migration scripts to be added
- Connection pooling for better performance
- Support for multiple instances

### Deployment to Vercel

The habit tracker is designed to work with Vercel's serverless functions:

1. **Environment Variables**: Set in Vercel dashboard
2. **Database**: Use persistent volume or external PostgreSQL
3. **Deployment**: Automatic via `npm run deploy`

## Testing

### Unit Tests
```bash
npm run test:unit
```

### Integration Tests
```bash
npm run test:integration
```

### End-to-End Tests
```bash
npm run test:e2e
```

## Performance Considerations

- **Rate Limiting**: GitHub API has rate limits (5000 requests/hour)
- **Caching**: Data is persisted to minimize API calls
- **Batch Processing**: Fetches multiple pages efficiently
- **Incremental Updates**: Only updates changed data

## Data Flow

1. **Initial Sync**: Fetches last 365 days of PR data
2. **Incremental Updates**: Only fetches new data since last sync
3. **Daily Processing**: Counts PRs per day and stores in database
4. **Statistics Calculation**: Real-time calculation of streaks and averages

## Troubleshooting

### Common Issues

1. **Rate Limit Exceeded**:
   - Wait for rate limit reset (shown in response headers)
   - Reduce frequency of refresh calls

2. **Database Locked**:
   - Ensure only one instance is running
   - Check file permissions

3. **Authentication Errors**:
   - Verify GITHUB_TOKEN is valid
   - Check token scopes include repository access

### Logging

The system provides comprehensive logging:
- `🔄` Refresh operations
- `📅` Date range processing
- `📋` GitHub API calls
- `✅` Successful operations
- `❌` Error conditions

## Future Enhancements

- **Multiple Users**: Support for tracking multiple GitHub users
- **Advanced Analytics**: Trend analysis, goal setting, reminders
- **Webhook Integration**: Real-time updates via GitHub webhooks
- **Export Features**: CSV, JSON export capabilities
- **Visualization**: Built-in charts and graphs
- **Notifications**: Daily/weekly progress reports

## Contributing

This feature is part of a larger portfolio project. Please follow the existing code patterns and ensure all tests pass before submitting changes.

## License

MIT License - see main project for details.