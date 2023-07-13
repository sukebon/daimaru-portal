import { useAuthStore } from "../../store/useAuthStore";
import { User } from "../../types";

export const useAuthManagement = () => {
  const users = useAuthStore((state) => state.users);
  const currentUser = useAuthStore((state) => state.currentUser);

  const isAdminAuth = () => {
    const array = [
      "EVKsigM546MbnakzkDmG0QHlfmn2",
      "MBTOK9Jr0eRWVuoT2YXgZNMoBQH3",
    ];
    const result = array.includes(currentUser);
    return result;
  };

  const isAuth = (prop: string) => {
    const user:any = users.find((user) => user.uid === currentUser);
    if (!user) return false;
    return user[prop] ? true : false;
  };

  const isAuths = (props: string[]) => {
    const user:any = users.find((user) => user.uid === currentUser);
    if (!user) return false;
    return props.some((prop: string) => user[prop] ? true : false);
  };

  return { isAdminAuth, isAuth, isAuths };
};
