import { CONTRACT_NAMES_MAP } from './contractNames'

import ACL from '../../artifacts-external/userdoc/ACL.json'
import CompositePostRebaseBeaconReceiver from '../../artifacts-external/userdoc/CompositePostRebaseBeaconReceiver.json'
import DepositSecurityModule from '../../artifacts-external/userdoc/DepositSecurityModule.json'
import Finance from '../../artifacts-external/userdoc/Finance.json'
import LidoDAO from '../../artifacts-external/userdoc/LidoDAO.json'
import LidoOracle from '../../artifacts-external/userdoc/LidoOracle.json'
import MiniMeToken from '../../artifacts-external/userdoc/MiniMeToken.json'
import NodeOperatorsRegistry from '../../artifacts-external/userdoc/NodeOperatorsRegistry.json'
import StETH from '../../artifacts-external/userdoc/StETH.json'
import TokenManager from '../../artifacts-external/userdoc/TokenManager.json'
import Treasury from '../../artifacts-external/userdoc/Treasury.json'
import Voting from '../../artifacts-external/userdoc/Voting.json'

import type { UserdocContractNames, Userdoc } from './types'

export const USERDOCS_MAP = {
  [CONTRACT_NAMES_MAP.ACL]: ACL as Userdoc,
  [CONTRACT_NAMES_MAP.CompositePostRebaseBeaconReceiver]:
    CompositePostRebaseBeaconReceiver as Userdoc,
  [CONTRACT_NAMES_MAP.DepositSecurityModule]: DepositSecurityModule as Userdoc,
  [CONTRACT_NAMES_MAP.Finance]: Finance as Userdoc,
  [CONTRACT_NAMES_MAP.LidoDAO]: LidoDAO as Userdoc,
  [CONTRACT_NAMES_MAP.Oracle]: LidoOracle as Userdoc,
  [CONTRACT_NAMES_MAP.GovernanceToken]: MiniMeToken as Userdoc,
  [CONTRACT_NAMES_MAP.NodeOperatorsRegistry]: NodeOperatorsRegistry as Userdoc,
  [CONTRACT_NAMES_MAP.Steth]: StETH as Userdoc,
  [CONTRACT_NAMES_MAP.TokenManager]: TokenManager as Userdoc,
  [CONTRACT_NAMES_MAP.Treasury]: Treasury as Userdoc,
  [CONTRACT_NAMES_MAP.Voting]: Voting as Userdoc,
} as const

export const USERDOC_CONTRACT_NAMES_LIST = Object.keys(
  USERDOCS_MAP,
) as UserdocContractNames[]
