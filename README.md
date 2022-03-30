# Lido DAO Voting UI

## Pre-requisites

- Node.js v12+
- Yarn package manager

This project requires an .env file which is distributed via private communication channels. A sample can be found in .env.sample

## Development

Step 1. Copy the contents of `.env.sample` to `.env.local`

```bash
cp sample.env .env.local
```

Step 2. Fill out the `.env.local`. You may need to sign up for [Infura](https://infura.io/) or [Alchemy](https://www.alchemy.com/), if you haven't already, to be able to use Ethereum JSON RPC connection.

Step 3. Install dependencies

```bash
yarn install
```

Step 4. Start the development server

```bash
yarn dev
```

## Environment variables

Note! Avoid using `NEXT_PUBLIC_` environment variables as it hinders our CI pipeline. Please use server-side environment variables and pass them to the client using `getInitialProps` in `_app.js`.

## Automatic versioning

Note! This repo uses automatic versioning, please follow the [commit message conventions](https://www.conventionalcommits.org/en/v1.0.0/).

e.g.

```
git commit -m "fix: a bug in calculation"
git commit -m "feat: dark theme"
```

## Production

```bash
yarn build && yarn start
```

## Notable dependencies

- [Next.js](https://nextjs.org/docs)
- [Typescript](https://www.typescriptlang.org/)
- [Styled Components](https://styled-components.com/)
- [Lido UI](https://github.com/lidofinance/ui)
- [SWR](https://swr.vercel.app)
- [TypeChain](https://github.com/ethereum-ts/Typechain#readme)
- [Web3 React](https://github.com/NoahZinsmeister/web3-react#readme)
- [The Ethers Project](https://github.com/ethers-io/ethers.js/)
- [EVM Script Decoder](https://github.com/lidofinance/evm-script-decoder)
