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

## IPFS mode

The project supports a build mode purposed to produce specific version of the app to be deployed to ipfs. It differs from the default by returning static output files with the single `index.html` as the browser endpoint. The routing of the app in this mode is also differs. It is done completely on client-side and based on the hash part of the browser url. It is designed this way because ipfs infrastructure does not provide neither back-end nor nginx-like routing to redirect browser's requests.

```bash
yarn build-ipfs
```

There is the command to start development mode with ipfs features.

```bash
yarn dev-ipfs
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

To create new release:

1. Merge all changes to the `main` branch
1. Navigate to Repo => Actions
1. Run action "Prepare release" action against `main` branch
1. When action execution is finished, navigate to Repo => Pull requests
1. Find pull request named "chore(release): X.X.X" review and merge it with "Rebase and merge" (or "Squash and merge")
1. After merge release action will be triggered automatically
1. Navigate to Repo => Actions and see last actions logs for further details
