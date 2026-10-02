declare module '@appdeploy/sdk' {
  export const secrets: {
    listSecretNames(): Promise<string[]>;
    readSecret(name: string): Promise<string>;
  };
}
