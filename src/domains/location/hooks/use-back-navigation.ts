import { useLocation, useNavigate } from "react-router";

export function useBackNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return () => {
    const backUrl = location.state?.backUrl;

    if (backUrl) {
      navigate(backUrl);
      return;
    }
    navigate(-1);
  };
}
