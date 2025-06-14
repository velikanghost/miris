# Crypto Dashboard

A modern cryptocurrency data visualization dashboard built with Next.js, Apollo Client, GraphQL, Tailwind CSS, and Shadcn UI. Features a beautiful green-themed design and real-time data updates.

## 🚀 Features

- **Real-time Data**: Live cryptocurrency prices, volumes, and market data
- **Interactive Charts**: Beautiful charts powered by Recharts
- **Token Cards**: Detailed information for top cryptocurrencies
- **Liquidity Pools**: Track DEX pool performance and APR
- **Search & Filter**: Find specific tokens quickly
- **Responsive Design**: Works perfectly on all devices
- **Green Theme**: Beautiful green-themed UI with dark mode support
- **GraphQL Integration**: Powered by Apollo Client for efficient data fetching

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Data Fetching**: Apollo Client + GraphQL
- **Charts**: Recharts
- **Icons**: Lucide React

## 🎨 Design Features

- Green color scheme optimized for crypto/finance
- Glassmorphism cards with subtle shadows
- Gradient backgrounds and accents
- Responsive grid layouts
- Interactive hover effects
- Professional typography with Geist fonts

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd crypto-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_GRAPHQL_URL=https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3
   NEXT_PUBLIC_APP_NAME="Crypto Dashboard"
   NEXT_PUBLIC_APP_DESCRIPTION="Real-time cryptocurrency data visualization"
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### GraphQL Endpoints

The app is configured to work with various GraphQL endpoints. You can switch between different data sources by updating the `NEXT_PUBLIC_GRAPHQL_URL` environment variable:

- **Uniswap V3**: `https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3`
- **SushiSwap**: `https://api.thegraph.com/subgraphs/name/sushiswap/exchange`
- **Compound**: `https://api.thegraph.com/subgraphs/name/messari/compound-v2-ethereum`

### Theme Customization

The green theme can be customized in `src/app/globals.css`. The design uses CSS custom properties for easy theming:

```css
:root {
  --primary: oklch(0.45 0.18 130); /* Main green color */
  --chart-1: oklch(0.55 0.15 130); /* Chart color 1 */
  /* ... other color variables */
}
```

## 📁 Project Structure

```
src/
├── app/                      # Next.js app directory
│   ├── globals.css          # Global styles and theme
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Main page
├── components/
│   ├── dashboard/           # Dashboard components
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── TokenCard.tsx    # Token display cards
│   │   ├── ChartCard.tsx    # Chart components
│   │   └── PoolTable.tsx    # Liquidity pool table
│   ├── providers/           # Context providers
│   │   └── ApolloProvider.tsx
│   └── ui/                  # Shadcn UI components
├── lib/
│   ├── apollo-client.ts     # Apollo Client configuration
│   ├── utils.ts             # Utility functions
│   └── graphql/
│       └── queries.ts       # GraphQL queries
```

## 🎯 Key Components

### Dashboard

The main dashboard component that orchestrates all data display and user interactions.

### TokenCard

Individual cards displaying cryptocurrency information including:

- Token symbol and name
- Current price
- 24h price change
- Volume and market cap

### ChartCard

Interactive charts showing price movements over time with:

- Responsive design
- Hover tooltips
- Customizable colors
- Time-based data

### PoolTable

Table displaying liquidity pool information including:

- Token pairs
- Total Value Locked (TVL)
- 24h volume and fees
- Calculated APR

## 🔄 Data Sources

The app uses GraphQL to fetch data from The Graph protocol, specifically:

- Token prices and metadata
- Trading volumes
- Liquidity pool information
- Historical price data

Mock data is included for development and testing purposes.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:

- **Desktop**: Full-featured layout with multiple columns
- **Tablet**: Adapted grid layouts
- **Mobile**: Stacked layout with touch-friendly interactions

## 🎨 Color Scheme

The green theme includes:

- **Primary Green**: `#10b981` (Emerald 500)
- **Light Green**: `#d1fae5` (Emerald 50)
- **Dark Green**: `#064e3b` (Emerald 900)
- **Accent Colors**: Various shades of green and complementary colors

## 🔧 Development

### Adding New Components

1. Create component in appropriate directory
2. Follow the existing naming conventions
3. Use TypeScript interfaces for props
4. Apply consistent styling with Tailwind classes

### Extending GraphQL Queries

1. Add new queries to `src/lib/graphql/queries.ts`
2. Update TypeScript interfaces
3. Implement in components using `useQuery` hook

### Customizing Styles

1. Global styles: `src/app/globals.css`
2. Component styles: Use Tailwind classes
3. Custom utilities: Add to globals.css

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using Next.js, Apollo Client, and modern web technologies.
