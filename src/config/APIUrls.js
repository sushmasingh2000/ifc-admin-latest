
// export const domain = "http://192.168.18.101:9007"
// export const front_end_domain = "http://192.168.18.101:3001"


export const domain = "https://ifctrade.io"
export const front_end_domain = "https://panel.ifctrade.io"
export const frontend = "https://ifctrade.io"
export const email_for_topup = "maapadmaa1176@gmail.com"


export const API_URLS = {
  send_otp: `${domain}/api/v1/send-otp`,
  verify_otp: `${domain}/api/v1/verify-otp`,
  member_registration: `${domain}/api/v1/member-registration`,
  member_login: `${domain}/api/v1/admin-login`,
  verify_2fa: `${domain}/api/v1/verify-2fa`,
  member_name_cust_id: `${domain}/api/v1/member-name-by-cust-id`,
  paying_dummy: `${domain}/api/v1/user-payin-dummy`,
  paying_request: `${domain}/api/v1/user-payin-req`,
  get_report_details: `${domain}/api/v1/get-report-details`,
  member_details: `${domain}/api/v1/member-profile-details`,
  get_reward_achievers: `${domain}/api/v1/get-reward-achievers-list`,
  claimed_reward: `${domain}/api/v1/claimed-reward`,
  activation_user: `${domain}/api/v1/user-activation-from-spot-wallet`,
  member_payout: `${domain}/api/v1/member-payout`,
  member_dashboard: `${domain}/api/v1/member-dashboard`,
  get_member_downline: `${domain}/api/v1/get-member-downline`,
  get_member_downline_tree: `${domain}/api/v1/get-member-downline-tree`,
  member_compound_request: `${domain}/api/v1/member-compound-request`,


  // admin
  verify_admin_otp: `${domain}/api/v1/setup-fa-authentication`,
  member_topup_by_admin: `${domain}/api/v1/member-topup-by-admin`,
  member_details_admin: `/api/v1/member-details`,
  change_member_profile: `/api/v1/change-member-profile`,
  get_report_details: `/api/v1/get-report-details`,
  get_admin_dashboard: `/api/v1/get-admin-dashboard`,
  admin_member_payout: `/api/v1/member-payout-report`,
  admin_withdrawal_approve: `/api/v1/withdrawal-approval-from-admin`,
  get_all_transfer_details: `/api/v1/get-all-transfer-history`,
  get_spot_deposit_details: `/api/v1/get-spot-deposit-history`,
  get_all_wallet_details: `/api/v1/get-all-user-wallet`,
  get_promotional_bonus: `/api/v1/get-promotional-bonus`,

};
