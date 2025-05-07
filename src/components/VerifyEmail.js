import { useEffect } from "react";
import { useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { email } = useParams();

  useEffect(() => {
    fetch(`https://brave-smoke-0773e2a1e.6.azurestaticapps.net/verify/${email}`, { method: "POST" })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, [email]);

  return <h2>Verifying Email...</h2>;
};

export default VerifyEmail;
