export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string;
}


export interface IUserResponse {
    "id": string,
    "fullName": string,
    "username": string,
    "email": string,
    "bio": string,
    "phone": string,
    "country": string,
    "avatar": null,
    "role": "admin" | "user",
    "createdAt": string,
    "updatedAt": string
}

export interface IUserStore {
  user: IUserResponse | null;
  setUser: (user: IUserResponse) => void;
  logOut: () => void;
}