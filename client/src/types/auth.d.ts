export interface SignUpDataErrors {
  name: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  password: string | undefined;
}

export interface SignInDataErrors {
  usernameOrEmail: string | undefined;
  password: string | undefined;
}

type Dictionary = {
  [key: string]: string;
};

interface ErrorsList {
  instancePath: string;
  message: string;
}

interface ErrorApi {
  instancePath: string;
  message: string;
}

interface UserData {
  id: string;
  isNewUser: boolean;
  typeSingUp: string;
  email: string;
  username: string;
  lastName: string;
  name: string;
  gender: string;
  profilePicture: string;
  about: string;
  birthDay: string;
  createAt: string;
  updatedAt: string;
  isProfilePrivate: string;
  contacts: Contact[];
}

interface InitialStateUser {
  isLoggedIn: boolean;
  userData: undefined | UserData | Dictionary;
}

interface InitialStateInterface {
  contactsPage: boolean;
  profilePage: {
    show: boolean;
    profileId: string;
  };
  searchPage: boolean;
}
interface InitialStateCurrentChat {
  currentChatData: undefined | ContactInfo | Dictionary;
}

interface SetProperty {
  name: string;
  value: any;
}
