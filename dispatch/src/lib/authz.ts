// Role-based rules shared by server actions and UI.
//
// Approval is restricted to owners so a member can't publish their own
// (or anyone's) work as company-approved — separation of duties is what
// makes the "Approved" badge trustworthy.

export const APPROVAL_DENIED_ERROR =
  "Only organization owners can approve assets."

export function canApprove(role: string) {
  return role === "owner"
}
