# Lido DAO Voting UI

### Abstract

Over the past year, there were multiple situations with Aragon voting UI being unavailable or dysfunctional at the times of ongoing DAO votings. It is critical to have a UI-friendly fallback option in the form of Lido's own resilient voting UI app.

### Functionality

The proposed UI consists of one essential page with a limited set of actions available.

The required functionality includes:

- accessing specific voting outside of Aragon voting UI
- getting on-chain details related to specific voting by voting ID (status, voting results, voting start/end date, parsed EVM script)
- connecting wallet (similar to Lido on Ethereum staking widget)
- casting vote (Yes/No)

[More details](
https://www.notion.so/Custom-voting-UI-feature-description-bde7fde42d3749a3afcbab3a56f26674)

## Pre-requisites

- Node.js v12+
- Yarn package manager

This project requires an .env file which is distributed via private communication channels. A sample can be found in .env.sample.

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

## Release flow

To create a new release:

1. Merge all changes to the `main` branch.
1. After the merge, the `Prepare release draft` action will run automatically. When the action is complete, a release draft is created.
1. When you need to release, go to Repo → Releases.
1. Publish the desired release draft manually by clicking the edit button - this release is now the `Latest Published`.
1. After publication, the action to create a release bump will be triggered automatically.