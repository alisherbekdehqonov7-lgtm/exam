export const setItem = (token: string) => localStorage.setItem("token", token);
export const getItem = (key: string) => localStorage.getItem(key);
export const removeItem = (key: string) => localStorage.removeItem(key);
