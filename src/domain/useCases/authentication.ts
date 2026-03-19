interface AuthenticationModel {
  email: string;
  password: string;
}

interface Authentication {
  auth(authentication: AuthenticationModel): Promise<string | null>;
}

export { Authentication, AuthenticationModel };

