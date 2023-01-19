import { contractNamesMap } from './contractNames'

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
import Voting from '../../artifacts-external/userdoc/Voting.json'

export const UserdocsMap = {
  [contractNamesMap.ACL]: ACL,
  [contractNamesMap.CompositePostRebaseBeaconReceiver]:
    CompositePostRebaseBeaconReceiver,
  [contractNamesMap.DepositSecurityModule]: DepositSecurityModule,
  [contractNamesMap.Finance]: Finance,
  [contractNamesMap.Finance]: LidoDAO,
  [contractNamesMap.Finance]: LidoOracle,
  [contractNamesMap.GovernanceToken]: MiniMeToken,
  [contractNamesMap.NodeOperatorsRegistry]: NodeOperatorsRegistry,
  [contractNamesMap.Steth]: StETH,
  [contractNamesMap.TokenManager]: TokenManager,
  [contractNamesMap.Voting]: Voting,
} as const
