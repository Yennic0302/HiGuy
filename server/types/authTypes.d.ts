export interface DataToSignUp {
  typeSingUp?: "google";
  name: string;
  lastName: string;
  email: string;
  password: string | "null";
  profilePicture: string | null;
}

export type TypeToSingIn = "username" | "email";

export interface DataToSignIn {
  typeToSignIn: TypeToSingIn;
  usernameOrEmail: string;
  password: string;
}
