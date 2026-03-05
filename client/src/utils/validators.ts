export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isValidDID(did: string): boolean {
  return /^did:creditmesh:[a-zA-Z0-9]+$/.test(did);
}
