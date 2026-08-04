This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## AI Tool: checkDataBalance

The Spectranet Support Assistant can call one server-side tool.

**Name:** `checkDataBalance`

**Input schema:** none (empty object) — checks the single mock account, no parameters needed.

**Return shape:**

```ts
{
  planName: string;
  dataUsedGB: number;
  dataTotalGB: number;
  daysUntilRenewal: number;
}
```

**Behavior:** The assistant automatically calls this tool whenever a user asks about their data balance, internet plan, or usage. The tool returns mock account information that is rendered as a balance card with a usage progress bar and renewal countdown.

**Rendered tool states:**

- `input-streaming` – preparing to call the tool.
- `input-available` – a shape-matching loading skeleton is displayed while waiting for the tool response.
- `output-available` – the balance card is rendered with the returned data.
- `output-error` – a styled error card is shown instead of crashing the application.
