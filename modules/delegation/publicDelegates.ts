import getConfig from 'next/config'

const basePath = getConfig().publicRuntimeConfig.basePath || ''

// The list of public delegates was provided by DAO Ops workstream member
export const PUBLIC_DELEGATES = [
  {
    name: 'Ignas',
    avatar: `${basePath}/delegates/ignas.png`,
    address: '0x3DDC7d25c7a1dc381443e491Bbf1Caa8928A05B0',
    lido: 'https://research.lido.fi/t/ignas-delegate-thread/8135',
    twitter: 'https://x.com/DefiIgnas',
  },
  {
    name: 'Wintermute Governance',
    avatar: `${basePath}/delegates/wintermute.png`,
    address: '0xB933AEe47C438f22DE0747D57fc239FE37878Dd1',
    lido: 'https://research.lido.fi/t/wintermute-governance-delegate-thread/8131',
    twitter: 'https://x.com/wintermute_t',
  },
  {
    name: 'Tane',
    avatar: `${basePath}/delegates/tane.png`,
    address: '0xB79294D00848a3A4C00c22D9367F19B4280689D7',
    lido: 'https://research.lido.fi/t/tane-delegate-thread/7639',
    twitter: 'https://x.com/tanelabs',
  },
  {
    name: 'SEEDOrg',
    avatar: `${basePath}/delegates/seedorg.jpeg`,
    address: '0xc1c2e8a21b86e41d1e706c232a2db5581b3524f8',
    lido: 'https://research.lido.fi/t/seedgov-delegate-thread/7643',
    twitter: 'https://x.com/SEEDGov',
  },
  {
    name: 'Anthony Leuts',
    avatar: `${basePath}/delegates/leuts.jpeg`,
    address: '0x42E6DD8D517abB3E4f6611Ca53a8D1243C183fB0',
    lido: 'https://research.lido.fi/t/anthony-leuts-delegate-thread/8019',
    twitter: 'https://x.com/A_Leutenegger',
  },
  {
    name: 'Polar',
    avatar: `${basePath}/delegates/polar.jpeg`,
    address: '0x1f76a6Bf03429480472B3695E08689219cE15ED6',
    lido: 'https://research.lido.fi/t/polar-delegate-thread/8048',
    twitter: 'https://x.com/post_polar_',
  },
  {
    name: 'TokenLogic',
    avatar: `${basePath}/delegates/tokenlogic.png`,
    address: '0x2cc1ADE245020FC5AAE66Ad443e1F66e01c54Df1',
    lido: 'https://research.lido.fi/t/tokenlogic-delegate-thread/8066',
    twitter: 'https://x.com/Token_Logic',
  },
  {
    name: 'BlockworksResearch',
    avatar: `${basePath}/delegates/blockworks.jpeg`,
    address: '0xfF4139e99Bd7c23F4611dc660c33c97A825EA67b',
    lido: 'https://research.lido.fi/t/blockworks-research-delegate-thread/8024',
    twitter: 'https://x.com/blockworksres',
  },
  {
    name: 'karpatkey',
    avatar: `${basePath}/delegates/karpatkey.png`,
    address: '0x8787FC2De4De95c53e5E3a4e5459247D9773ea52',
    lido: 'https://research.lido.fi/t/karpatkey-delegate-thread/8011',
    twitter: 'https://x.com/karpatkey',
  },
  {
    name: 'StableLab',
    avatar: `${basePath}/delegates/stablelab.png`,
    address: '0xECC2a9240268BC7a26386ecB49E1Befca2706AC9',
    lido: 'https://research.lido.fi/t/stablelab-delegate-thread-updated/4904/17',
    twitter: 'https://x.com/Stablelab',
  },
  {
    name: 'DegentradingLSD',
    avatar: `${basePath}/delegates/degentrading.jpg`,
    address: '0xbeb3364D14DbB4D9A406966B97B9FB3fF8aB7646',
    lido: 'https://research.lido.fi/t/degentradinglsd-delegate-thread/8149',
    twitter: 'https://x.com/degentradingLSD',
  },
  {
    name: 'eboadom (Ernesto)',
    avatar: `${basePath}/delegates/eboadom.png`,
    address: '0x5Ef980c7bdA50c81E8FB13DfF2b804113065ED1c',
    lido: 'https://research.lido.fi/t/eboadom-delegate-thread/8079',
    twitter: 'https://x.com/eboadom',
  },
  {
    name: 'Pol Lanski',
    avatar: `${basePath}/delegates/lanski.png`,
    address: '0xB6647e02AE6Dd74137cB80b1C24333852E4AF890',
    lido: 'https://research.lido.fi/t/pol-lanski-delegate-thread/8155',
    twitter: 'https://x.com/Pol_Lanski',
  },
  {
    name: 'notjamiedimon',
    avatar: `${basePath}/delegates/notjamiedimon.jpg`,
    address: '0xCE3b1e215f379A5edDbc1ee80a6dE089c0b92e55',
    lido: 'https://research.lido.fi/t/notjamiedimon-delegate-thread/8174',
    twitter: 'https://x.com/regentrading',
  },
  {
    name: 'Irina',
    avatar: `${basePath}/delegates/irina.jpeg`,
    address: '0x06A90756e57bC7A016Eed0aB23fC36d11C42bBa0',
    lido: 'https://research.lido.fi/t/irina-delegate-thread/8217',
    twitter: 'https://x.com/eth_everstake',
  },
  {
    name: 'ProRelGuild',
    avatar: null,
    address: '0x7A5959855B6508aF1055Af460331fB697dd08e22',
    lido: 'https://research.lido.fi/t/prorelguild-delegate-thread/8186',
    twitter: 'https://x.com/apegenija',
  },
  {
    name: 'cp0x',
    avatar: `${basePath}/delegates/cp0x.jpeg`,
    address: '0x6f9BB7e454f5B3eb2310343f0E99269dC2BB8A1d',
    lido: 'https://research.lido.fi/t/cp0x-delegate-thread/8193',
    twitter: 'https://x.com/cp0xdotcom',
  },
  {
    name: 'Simply Staking',
    avatar: `${basePath}/delegates/simplystaking.png`,
    address: '0xCeDF324843775c9E7f695251001531798545614B',
    lido: 'https://research.lido.fi/t/simply-staking-delegate-thread/8178',
    twitter: 'https://x.com/SimplyStaking',
  },
  {
    name: 'Nansen',
    avatar: `${basePath}/delegates/nansen.png`,
    address: '0xa4181C75495f60106AE539B7C55c0D263f2fb737',
    lido: 'https://research.lido.fi/t/nansen-delegate-thread/8303',
    twitter: 'https://x.com/nansen_ai',
  },
  {
    name: 'DAOplomats',
    avatar: `${basePath}/delegates/daoplomats.png`,
    address: '0x057928bc52bD08e4D7cE24bF47E01cE99E074048',
    lido: 'https://research.lido.fi/t/daoplomats-delegate-thread/8242',
    twitter: 'https://x.com/DAOplomats',
  },
  {
    name: 'PGov.eth',
    avatar: `${basePath}/delegates/pgov.jpeg`,
    address: '0x3FB19771947072629C8EEE7995a2eF23B72d4C8A',
    lido: 'https://research.lido.fi/t/pgov-delegate-thread/8232',
    twitter: 'https://x.com/PGovTeam',
  },
  {
    name: 'marcbcs',
    avatar: `${basePath}/delegates/marcbcs.jpeg`,
    address: '0x98308b6dA79B47D15e9438CB66831563649Dbd94',
    lido: 'https://research.lido.fi/t/marcbcs-delegate-thread/8209',
    twitter: 'https://x.com/marcbcs',
  },
]
