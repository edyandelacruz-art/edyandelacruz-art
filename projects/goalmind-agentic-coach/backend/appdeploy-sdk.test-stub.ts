export const secrets = {
  async listSecretNames(): Promise<string[]> { return []; },
  async readSecret(_name: string): Promise<string | undefined> { return undefined; },
};
