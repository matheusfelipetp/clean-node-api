import { AccountModel } from "../models/account";

interface LoadAccountByToken {
  load(accessToken: string, role?: string): Promise<AccountModel | null>;
}

export { LoadAccountByToken };
