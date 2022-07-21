import classes from "./CreateModal.module.css";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import { useState } from "react";
import { useContext } from "react";
import { GenContext } from "../../../gen-state/gen.context";
import { createSession, setCollectionName } from "../../../gen-state/gen.actions";
import { v4 as uuid } from "uuid";

const CreateModal = ({ modal, closeModal }) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);

  const { dispatch } = useContext(GenContext);

  const handleChange = (e) => {
    setError(false);
    setInputValue(e.target.value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (!inputValue) return setError(true);
    dispatch(createSession(uuid()));
    dispatch(setCollectionName(inputValue));
    handleClose();
  };

  const handleClose = () => {
    closeModal();
  };

  return (
    <div className={`${classes.container} ${modal && classes.active}`}>
      <div className={classes.wrapper}>
        {/* <CloseIcon onClick={handleClose} className={classes.closeBtn} /> */}
        <form onSubmit={handleClick} className={classes.content}>
          <h3>Let’s get cracking!</h3>
          <h6>Every Collection is Unique</h6>
          <p>
            Input any awesome collection name you want and click continue <br /> Don’t worry, you can always change it
            later.
          </p>
          <div className={`${classes.inputContainer} ${error && classes.error}`}>
            <label> Collection name </label>
            <input value={inputValue} onChange={handleChange} type="text" placeholder="Minority_Drop" />
          </div>
          <button className={`${inputValue && classes.active}`} onClick={handleClick}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
