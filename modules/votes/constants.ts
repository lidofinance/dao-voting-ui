import { solidityKeccak256 } from 'ethers/lib/utils'

const keccakRole = (role: string) => solidityKeccak256(['string'], [role])

export const LIDO_ROLES: Partial<Record<string, string>> = {
  [keccakRole('APP_MANAGER_ROLE')]: 'APP MANAGER ROLE',
  [keccakRole('UNSAFELY_MODIFY_VOTE_TIME_ROLE')]:
    'UNSAFELY MODIFY VOTE TIME ROLE',
  [keccakRole('MODIFY_QUORUM_ROLE')]: 'MODIFY QUORUM ROLE',
  [keccakRole('MODIFY_SUPPORT_ROLE')]: 'MODIFY SUPPORT ROLE',
  [keccakRole('CREATE_VOTES_ROLE')]: 'CREATE VOTES ROLE',
  [keccakRole('ISSUE_ROLE')]: 'ISSUE ROLE',
  [keccakRole('ASSIGN_ROLE')]: 'ASSIGN ROLE',
  [keccakRole('BURN_ROLE')]: 'BURN ROLE',
  [keccakRole('MINT_ROLE')]: 'MINT ROLE',
  [keccakRole('REVOKE_VESTINGS_ROLE')]: 'REVOKE VESTINGS ROLE',
  [keccakRole('CREATE_PAYMENTS_ROLE')]: 'CREATE PAYMENTS ROLE',
  [keccakRole('CHANGE_PERIOD_ROLE')]: 'CHANGE PERIOD ROLE',
  [keccakRole('CHANGE_BUDGETS_ROLE')]: 'CHANGE BUDGETS ROLE',
  [keccakRole('EXECUTE_PAYMENTS_ROLE')]: 'EXECUTE PAYMENTS ROLE',
  [keccakRole('MANAGE_PAYMENTS_ROLE')]: 'MANAGE PAYMENTS ROLE',
  [keccakRole('CREATE_PAYMENTS_ROLE')]: 'CREATE PAYMENTS ROLE',
  [keccakRole('ADD_PROTECTED_TOKEN_ROLE')]: 'ADD PROTECTED TOKEN ROLE',
  [keccakRole('TRANSFER_ROLE')]: 'TRANSFER ROLE',
  [keccakRole('RUN_SCRIPT_ROLE')]: 'RUN SCRIPT ROLE',
  [keccakRole('SAFE_EXECUTE_ROLE')]: 'SAFE EXECUTE ROLE',
  [keccakRole('REMOVE_PROTECTED_TOKEN_ROLE')]: 'REMOVE PROTECTED TOKEN ROLE',
  [keccakRole('DESIGNATE_SIGNER_ROLE')]: 'DESIGNATE SIGNER ROLE',
  [keccakRole('EXECUTE_ROLE')]: 'EXECUTE ROLE',
  [keccakRole('CREATE_PERMISSIONS_ROLE')]: 'CREATE PERMISSIONS ROLE',
  [keccakRole('CREATE_VERSION_ROLE')]: 'CREATE VERSION ROLE',
  [keccakRole('SET_NODE_OPERATOR_ADDRESS_ROLE')]:
    'SET NODE OPERATOR ADDRESS ROLE',
  [keccakRole('SET_NODE_OPERATOR_NAME_ROLE')]: 'SET NODE OPERATOR NAME ROLE',
  [keccakRole('ADD_NODE_OPERATOR_ROLE')]: 'ADD NODE OPERATOR ROLE',
  [keccakRole('REPORT_STOPPED_VALIDATORS_ROLE')]:
    'REPORT STOPPED VALIDATORS ROLE',
  [keccakRole('SET_NODE_OPERATOR_ACTIVE_ROLE')]:
    'SET NODE OPERATOR ACTIVE ROLE',
  [keccakRole('SET_NODE_OPERATOR_LIMIT_ROLE')]: 'SET NODE OPERATOR LIMIT ROLE',
  [keccakRole('MANAGE_QUORUM')]: 'MANAGE QUORUM',
  [keccakRole('SET_BEACON_REPORT_RECEIVER')]: 'SET BEACON REPORT RECEIVER',
  [keccakRole('MANAGE_MEMBERS')]: 'MANAGE MEMBERS',
  [keccakRole('SET_BEACON_SPEC')]: 'SET BEACON SPEC',
  [keccakRole('SET_REPORT_BOUNDARIES')]: 'SET REPORT BOUNDARIES',
  [keccakRole('RESUME_ROLE')]: 'RESUME ROLE',
  [keccakRole('STAKING_PAUSE_ROLE')]: 'STAKING PAUSE ROLE',
  [keccakRole('STAKING_CONTROL_ROLE')]: 'STAKING CONTROL ROLE',
  [keccakRole('MANAGE_PROTOCOL_CONTRACTS_ROLE')]:
    'MANAGE PROTOCOL CONTRACTS ROLE',
  [keccakRole('SET_EL_REWARDS_VAULT_ROLE')]: 'SET EL REWARDS VAULT ROLE',
  [keccakRole('SET_EL_REWARDS_WITHDRAWAL_LIMIT_ROLE')]:
    'SET EL REWARDS WITHDRAWAL LIMIT ROLE',
  [keccakRole('DEPOSIT_ROLE')]: 'DEPOSIT ROLE',
  [keccakRole('STAKING_ROUTER_ROLE')]: 'STAKING ROUTER ROLE',
  [keccakRole('MANAGE_SIGNING_KEYS')]: 'MANAGE SIGNING KEYS',
  [keccakRole('STAKING_MODULE_PAUSE_ROLE')]: 'STAKING MODULE PAUSE ROLE',
  [keccakRole('STAKING_MODULE_RESUME_ROLE')]: 'STAKING MODULE RESUME ROLE',
  [keccakRole('STAKING_MODULE_UNVETTING_ROLE')]:
    'STAKING MODULE UNVETTING ROLE',
  [keccakRole('MANAGE_CONSENSUS_VERSION_ROLE')]:
    'MANAGE CONSENSUS VERSION ROLE',
  [keccakRole('REQUEST_BURN_SHARES_ROLE')]: 'REQUEST BURN SHARES ROLE',
  [keccakRole('MANAGE_MEMBERS_AND_QUORUM_ROLE')]:
    'MANAGE MEMBERS AND QUORUM ROLE',
  [keccakRole('DEFAULT_ADMIN_ROLE')]: 'DEFAULT ADMIN ROLE',
  [keccakRole('CONFIG_MANAGER_ROLE')]: 'CONFIG MANAGER ROLE',
  [keccakRole('MANAGE_FAST_LANE_CONFIG_ROLE')]: 'MANAGE FAST LANE CONFIG ROLE',
  [keccakRole('MANAGE_REPORT_PROCESSOR_ROLE')]: 'MANAGE REPORT PROCESSOR ROLE',
  [keccakRole('MANAGE_FRAME_CONFIG_ROLE')]: 'MANAGE FRAME CONFIG ROLE',
  [keccakRole('DISABLE_CONSENSUS_ROLE')]: 'DISABLE CONSENSUS ROLE',
  [keccakRole('MANAGE_CONSENSUS_CONTRACT_ROLE')]:
    'MANAGE CONSENSUS CONTRACT ROLE',
  [keccakRole('SUBMIT_DATA_ROLE')]: 'SUBMIT DATA ROLE',
  [keccakRole('PAUSE_ROLE')]: 'PAUSE ROLE',
  [keccakRole('REQUEST_BURN_MY_STETH_ROLE')]: 'REQUEST BURN MY STETH ROLE',
  [keccakRole('RECOVER_ASSETS_ROLE')]: 'RECOVER ASSETS ROLE',
  [keccakRole('ALL_LIMITS_MANAGER_ROLE')]: 'ALL LIMITS MANAGER ROLE',
  [keccakRole('CHURN_VALIDATORS_PER_DAY_LIMIT_MANGER_ROLE')]:
    'CHURN VALIDATORS PER DAY LIMIT MANGER ROLE',
  [keccakRole('ONE_OFF_CL_BALANCE_DECREASE_LIMIT_MANAGER_ROLE')]:
    'ONE OFF CL BALANCE DECREASE LIMIT MANAGER ROLE',
  [keccakRole('ANNUAL_BALANCE_INCREASE_LIMIT_MANAGER_ROLE')]:
    'ANNUAL BALANCE INCREASE LIMIT MANAGER ROLE',
  [keccakRole('SHARE_RATE_DEVIATION_LIMIT_MANAGER_ROLE')]:
    'SHARE RATE DEVIATION LIMIT MANAGER ROLE',
  [keccakRole('MAX_VALIDATOR_EXIT_REQUESTS_PER_REPORT_ROLE')]:
    'MAX VALIDATOR EXIT REQUESTS PER REPORT ROLE',
  [keccakRole('MAX_ACCOUNTING_EXTRA_DATA_LIST_ITEMS_COUNT_ROLE')]:
    'MAX ACCOUNTING EXTRA DATA LIST ITEMS COUNT ROLE',
  [keccakRole('MAX_NODE_OPERATORS_PER_EXTRA_DATA_ITEM_COUNT_ROLE')]:
    'MAX NODE OPERATORS PER EXTRA DATA ITEM COUNT ROLE',
  [keccakRole('REQUEST_TIMESTAMP_MARGIN_MANAGER_ROLE')]:
    'REQUEST TIMESTAMP MARGIN MANAGER ROLE',
  [keccakRole('MAX_POSITIVE_TOKEN_REBASE_MANAGER_ROLE')]:
    'MAX POSITIVE TOKEN REBASE MANAGER ROLE',
  [keccakRole('APPEARED_VALIDATORS_PER_DAY_LIMIT_MANAGER_ROLE')]:
    'APPEARED VALIDATORS PER DAY LIMIT MANAGER ROLE',
  [keccakRole('EXITED_VALIDATORS_PER_DAY_LIMIT_MANAGER_ROLE')]:
    'EXITED VALIDATORS PER DAY LIMIT MANAGER ROLE',
  [keccakRole('ACCOUNTING_MANAGER_ROLE')]: 'ACCOUNTING MANAGER ROLE',
  [keccakRole('FINALIZE_ROLE')]: 'FINALIZE ROLE',
  [keccakRole('ORACLE_ROLE')]: 'ORACLE ROLE',
  [keccakRole('MANAGE_TOKEN_URI_ROLE')]: 'MANAGE TOKEN URI ROLE',
  [keccakRole('MANAGE_WITHDRAWAL_CREDENTIALS_ROLE')]:
    'MANAGE WITHDRAWAL CREDENTIALS ROLE',
  [keccakRole('STAKING_MODULE_MANAGE_ROLE')]: 'STAKING MODULE MANAGE ROLE',
  [keccakRole('REPORT_EXITED_VALIDATORS_ROLE')]:
    'REPORT EXITED VALIDATORS ROLE',
  [keccakRole('UNSAFE_SET_EXITED_VALIDATORS_ROLE')]:
    'UNSAFE SET EXITED VALIDATORS ROLE',
  [keccakRole('REPORT_REWARDS_MINTED_ROLE')]: 'REPORT REWARDS MINTED ROLE',
  [keccakRole('RECOVERER_ROLE')]: 'RECOVERER ROLE',
  [keccakRole('RESET_BOND_CURVE_ROLE')]: 'RESET BOND CURVE ROLE',
  [keccakRole('SET_BOND_CURVE_ROLE')]: 'SET BOND CURVE ROLE',
  [keccakRole('MANAGE_BOND_CURVES_ROLE')]: 'MANAGE BOND CURVES ROLE',
  [keccakRole('CONTRACT_MANAGER_ROLE')]: 'CONTRACT MANAGER ROLE',
}
