# YNAB CSV Converter

A simple static website to convert bank CSV files to YNAB-compatible format.

## Features

- Client-side CSV conversion (no data uploaded to servers)
- Converts date format from YYYY-MM-DD to MM/DD/YYYY
- Flips amount signs to match YNAB convention
- Outputs YNAB Format 2: Date, Payee, Memo, Amount

## Development

Install dependencies:

```bash
npm install
```

Build the project:

```bash
npm run build
```

Watch for changes during development:

```bash
npm run dev
```

## Deployment

Deploy to GitHub Pages:

```bash
npm run deploy
```

This will:

1. Compile TypeScript to JavaScript
2. Copy HTML and CSS files to the `dist` folder
3. Deploy the `dist` folder to the `gh-pages` branch

## Input Format

Your CSV should have these columns:

```csv
transaction_date, post_date, type, details, amount, currency
```

Example:

```csv
2024-01-15,2024-01-16,Purchase,Coffee Shop,15.50,USD
2024-01-16,2024-01-17,Payment,-1000.00,USD
```

## Output Format

YNAB Format 2:

```csv
Date,Payee,Memo,Amount
```

Example:

```csv
01/15/2024,Coffee Shop,Purchase,-15.50
01/16/2024,Payment,1000.00
```

## License

MIT
