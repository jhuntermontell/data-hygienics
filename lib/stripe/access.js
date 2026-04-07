export function getPlanAccess(plan) {
  return {
    canTakeAssessment: ['starter', 'professional', 'msp'].includes(plan),
    canDownloadReports: ['starter', 'professional', 'msp'].includes(plan),
    canAccessPolicies: ['professional', 'msp'].includes(plan),
    policyLimit: plan === 'starter' ? 2 : null,
    canAccessNewsFeed: ['starter', 'professional', 'msp'].includes(plan),
    canManageClients: plan === 'msp',
    maxClients: plan === 'msp' ? 10 : 0,
  }
}
