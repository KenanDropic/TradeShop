import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const useCurrentUser = () => {
  // redux
  const { isLogged } = useSelector((state) => state.users);

  //component level states
  const [logged, setLogged] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    if (isLogged) {
      setLogged(true);
    }
    setCheckingStatus(false);
  }, [isLogged]);
  return { logged, checkingStatus };
};
