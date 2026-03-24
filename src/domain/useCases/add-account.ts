import { AccountModel } from "../models/account";

interface AddAccountModel {
  name: string;
  email: string;
  password: string;
}

interface AddAccount {
  add(account: AddAccountModel): Promise<AccountModel | null>;
}

export { AddAccount, AddAccountModel };
