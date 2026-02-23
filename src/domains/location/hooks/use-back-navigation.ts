import { useNavigate } from "react-router";

export function useBackNavigation() {
  const navigate = useNavigate();

  return () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };
}
