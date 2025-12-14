/**
 * Workspace hooks - centralized exports
 */
export { useWorkspace } from "./useWorkspace";
export { useWorkspaceMembers } from "./useWorkspaceMembers";
export type { WorkspaceMember } from "./useWorkspaceMembers";
export { useClientWorkspaces } from "./useClientWorkspaces";
export { useUserWorkspaceRole, requiresApproval } from "./useUserWorkspaceRole";
export { useTeamMembers } from "../useTeamMembers";
export { useIsAdmin } from "../useIsAdmin";
export { useReferralStats } from "../useReferralStats";
export { useCurrentUser } from "../useCurrentUser";
export { useOnboardingProgress } from "../useOnboardingProgress";
