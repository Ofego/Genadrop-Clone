import { useContext, useEffect, useState } from "react";
import { setCollectionName, setCurrentSession } from "../../../gen-state/gen.actions";
import { GenContext } from "../../../gen-state/gen.context";
import { handleResetCreate } from "../../../utils";
import { v4 as uuid } from "uuid";
import { ReactComponent as SuccessIcon } from "../../../assets/icon-payment-successful.svg";
import classes from "./SuccessPlan.module.css";
import { useHistory } from "react-router-dom";

const SuccessPlan = () => {
  const history = useHistory();
  const [inputValue, setInputValue] = useState("");
  const { dispatch, upgradePlan, sessionId, currentPlan } = useContext(GenContext);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    dispatch(setCollectionName(inputValue));
    history.push("/create");
  };

  useEffect(() => {
    let ID = uuid();
    if (!upgradePlan) {
      handleResetCreate({ dispatch });
      dispatch(setCurrentSession(ID));
      dispatch(setCollectionName("New Collection"));
    } else if (!sessionId) {
      dispatch(setCurrentSession(ID));
      dispatch(setCollectionName("New Collection"));
    }
  }, []);

  useEffect(() => {
    if (currentPlan === "free") {
      return history.push("/create");
    }
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <SuccessIcon className={classes.successIcon} />
        <div className={classes.heading}>Payment Successful!</div>
        <div className={classes.description}>
          Good choice! Your payment for Hobby plan was successful. Input a collection name to proceed to the create
          page.
        </div>
        <form onSubmit={handleContinue}>
          <input onChange={handleChange} type="text" placeholder="Enter collection name" value={inputValue} />
          <button onClick={handleContinue} className={inputValue && classes.active}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuccessPlan;
