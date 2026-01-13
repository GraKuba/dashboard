# Farmer Dashboard

A production-ready React dashboard for agricultural data tracking and analytics, built with modern best practices.

## Key Features

### 1. Modern UI (Stripe-inspired)

- **Theme**: Light mode, clean whitespace, Inter font, and "Blurple" accents
- **Navigation**: Accessible sidebar with Lucide icons
- **Responsive**: Cards and charts adapt to screen size using CSS Grid

### 2. Comprehensive Data Entry

- **Structured Form**: Input split into logical sections (Metadata, Production, Resources, Costs)
- **Validation**: Prevents negative numbers and cross-validates field totals
- **Draft Persistence**: Form data auto-saved to `localStorage`

### 3. Real-time Analytics

- **Loading States**: Skeleton loaders provide visual feedback
- **Live Updates**: Supabase real-time subscriptions
- **Metrics**: Revenue/Hectare, GHG Emissions, Water Usage
- **Charts**: Dual-axis line chart (GHG vs Revenue), Bar chart (Water Productivity)

### 4. Production-Ready Architecture

- **Error Boundary**: Graceful error handling prevents white screen crashes
- **Code Splitting**: Lazy-loaded components reduce initial bundle size
- **Environment Validation**: Fails fast with clear error messages
- **CI/CD Pipeline**: Automated testing and builds via GitHub Actions

### 5. Accessibility (WCAG 2.1)

- Semantic HTML (`<nav>`, `<main>`, `<button>`)
- ARIA attributes for screen readers
- Skip-to-content link for keyboard navigation
- Focus indicators on interactive elements

---

## Tech Stack

| Layer        | Technology                            |
| ------------ | ------------------------------------- |
| **Frontend** | React 19, Vite 7                      |
| **Backend**  | Supabase (Postgres + Auth + Realtime) |
| **Charts**   | Recharts                              |
| **Styling**  | CSS Variables, CSS Grid               |
| **Testing**  | Vitest, React Testing Library         |
| **CI/CD**    | GitHub Actions                        |

---

## Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- Supabase project (for backend)

### Installation

```bash
# Clone repository
git clone https://github.com/GraKuba/dashboard.git
cd dashboard

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Available Scripts

| Command            | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Start development server |
| `npm run build`    | Build for production     |
| `npm run preview`  | Preview production build |
| `npm run lint`     | Run ESLint               |
| `npm run test`     | Run test suite           |
| `npm run coverage` | Generate coverage report |

---

## Testing & Quality

### Test Coverage

| Metric                 | Result     | Goal |
| ---------------------- | ---------- | ---- |
| **Statement Coverage** | **94.33%** | >90% |
| **Branch Coverage**    | **90.38%** | >85% |
| **Line Coverage**      | **95.20%** | >90% |
| **Tests Passing**      | **33**     | All  |

### Test Suite

```
src/
├── App.test.jsx           # Integration tests
├── Auth.test.jsx          # Authentication tests
├── Dashboard.test.jsx     # Dashboard component tests
├── ErrorBoundary.test.jsx # Error handling tests
├── InputForm.test.jsx     # Form validation tests
└── utils/
    └── validation.test.js # Validation logic tests
```

### Running Tests

```bash
npm run test              # Run all tests
npm run test -- --watch   # Watch mode
npm run coverage          # Generate coverage report
```

---

## Project Structure

```
src/
├── App.jsx              # Main app with routing & error boundary
├── Auth.jsx             # Authentication (login/signup)
├── Dashboard.jsx        # Analytics dashboard with charts
├── InputForm.jsx        # Data entry form
├── Sidebar.jsx          # Navigation sidebar
├── ErrorBoundary.jsx    # Error handling component
├── constants.js         # Centralized configuration
├── supabase.js          # Supabase client with env validation
├── index.css            # Global styles
└── utils/
    └── validation.js    # Form validation logic

.github/
└── workflows/
    └── ci.yml           # CI/CD pipeline

supabase/
└── migrations/          # Database migrations
```

---

## Architecture Highlights

### Error Handling

The app is wrapped in an `ErrorBoundary` that:

- Catches JavaScript errors anywhere in the component tree
- Displays a user-friendly fallback UI
- Provides "Refresh" and "Try Again" recovery options
- Shows error details in development mode

### Code Splitting

Heavy components are lazy-loaded to improve initial load time:

```javascript
const Dashboard = lazy(() => import("./Dashboard"));
const InputForm = lazy(() => import("./InputForm"));
```

**Bundle sizes:**

- Main bundle: ~408 KB
- Dashboard (lazy): ~361 KB
- InputForm (lazy): ~7 KB

### Constants & Configuration

Magic numbers and configuration are centralized in `constants.js`:

```javascript
export const VALIDATION = {
  BOX_TOLERANCE_PERCENT: 0.05, // 5% tolerance for box count validation
};

export const EMISSIONS = {
  DIESEL_KG_CO2_PER_LITER: 2.68,
  FERTILIZER_KG_CO2_PER_DOLLAR: 1.5,
};
```

---

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`):

```
┌─────────────┐     ┌─────────────┐
│  Lint &     │────▶│   Build     │
│  Test       │     │             │
└─────────────┘     └─────────────┘
      │                    │
      ▼                    ▼
 Coverage Report     Build Artifacts
```

- **Triggers**: Push/PR to `main` or `master`
- **Jobs**: Lint → Test → Coverage → Build
- **Artifacts**: Coverage reports and build output

---

## Database Schema

### Table: `monthly_reports`

| Column                     | Type        | Description              |
| -------------------------- | ----------- | ------------------------ |
| `id`                       | uuid        | Primary Key              |
| `user_id`                  | uuid        | Owner (FK to auth.users) |
| `created_at`               | timestamptz | Auto-generated timestamp |
| `month_date`               | date        | Reporting month          |
| `farm_area`                | numeric     | Farm area in hectares    |
| `boxes_produced`           | numeric     | Total boxes produced     |
| `boxes_export_customers`   | numeric     | Boxes sold to export     |
| `boxes_local_market`       | numeric     | Boxes sold locally       |
| `boxes_banana_meal`        | numeric     | Boxes used for meal      |
| `boxes_rejected`           | numeric     | Rejected boxes           |
| `waste_boxes_supply_chain` | numeric     | Supply chain waste       |
| `irrigation_hours`         | numeric     | Hours of irrigation      |
| `pump_capacity_gpm`        | numeric     | Pump capacity (GPM)      |
| `diesel_consumed_liters`   | numeric     | Fuel usage               |
| `fertilizer_cost_ga`       | numeric     | GA fertilizer cost       |
| `fertilizer_cost_gec`      | numeric     | GE.C fertilizer cost     |
| `labor_cost`               | numeric     | Total labor cost         |
| `maintenance_cost`         | numeric     | Maintenance expenses     |
| `avg_selling_price`        | numeric     | Average price per box    |

### View: `monthly_metrics`

Calculates derived KPIs:

- `total_revenue` - boxes × price
- `revenue_per_ha` - revenue / area
- `ghg_emissions_kg` - diesel + fertilizer emissions
- `water_usage_m3` - irrigation × pump capacity

---

## Security

### Row Level Security (RLS)

All database operations are protected by Postgres RLS:

- Users can only access their own data
- `user_id` column auto-populated via `DEFAULT auth.uid()`
- Policies enforce SELECT, INSERT, UPDATE, DELETE restrictions

### Data Integrity Constraints

```sql
CHECK (boxes_produced >= 0)
CHECK (irrigation_hours >= 0)
CHECK (diesel_consumed_liters >= 0)
```

### Environment Security

- Credentials stored in environment variables
- `.env` file excluded from version control
- CI/CD uses GitHub Secrets for production builds

---

## Deployment

### Cloudflare Pages

```bash
# Build settings
Build command: npm run build
Output directory: dist

# Environment variables (set in dashboard)
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```

### Vercel / Netlify

Similar configuration—set environment variables in the platform dashboard and use `npm run build` with `dist` as the output directory.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) for details.
