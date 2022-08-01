import classes from "./Session.module.css";
import { ReactComponent as ChevronIcon } from "../../assets/icon-chevron-down.svg";
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";
import { ReactComponent as MarkIcon } from "../../assets/icon-mark.svg";
import { ReactComponent as ArrowBackIcon } from "../../assets/icon-arrow-left.svg";
import { useContext, useState } from "react";
import { GenContext } from "../../gen-state/gen.context";
import {
  setCollectionName,
  setCurrentPlan,
  setCurrentSession,
  setLayers,
  setNftLayers,
  setSession,
  setToggleSessionModal,
} from "../../gen-state/gen.actions";
import { deleteAllLayers, fetchSession, fetchUserSession } from "../../renderless/store-data/StoreData.script";
import { useHistory } from "react-router-dom";
import { plans } from "../Pricing/Pricing.script";

const Session = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [dropdownId, setDropdown] = useState(-1);

  const { dispatch, currentUser, toggleSessionModal, sessions } = useContext(GenContext);

  const handleLoad = async (sessionId, currentPlan) => {
    console.log("fetch starts");
    setLoading(true);
    const res = await fetchUserSession({ currentUser, sessionId });
    if (res) {
      dispatch(setCurrentPlan(currentPlan));
      dispatch(setLayers(res.layers));
      dispatch(setNftLayers(res.nftLayers));
      dispatch(setCollectionName(res.collectionName));
      dispatch(setCurrentSession(sessionId));
      dispatch(setToggleSessionModal(false));
    }
    setLoading(false);
    console.log("fetch ends");
  };

  const handleDelete = async (sessionId) => {
    console.log("delete starts");
    setLoading(true);
    await deleteAllLayers({ currentUser, sessionId });
    const sessions = await fetchSession({ currentUser });
    dispatch(setSession(sessions));
    if (!sessions.length) {
      dispatch(setToggleSessionModal(false));
    }
    setLoading(false);
    console.log("delete ends");
  };

  const handleCreate = () => {
    history.push("/create/session/pricing");
    handleClose();
  };

  const handleDropdown = (id) => {
    if (id === dropdownId) return setDropdown(-1);
    setDropdown(id);
  };

  const handleClose = () => {
    dispatch(setToggleSessionModal(false));
  };

  return (
    <div className={`${classes.container} ${toggleSessionModal && classes.active}`}>
      <div onClick={() => history.goBack()} className={classes.backBtnContainer}>
        <ArrowBackIcon className={classes.backIcon} />
        <div>Back</div>
      </div>
      <div className={classes.wrapper}>
        <div className={` ${classes.loader} ${loading && classes.active}`}>
          <div className={classes.dots}>
            <div>Loading</div>
            <div className={classes.dotOne} />
            <div className={classes.dotTwo} />
            <div className={classes.dotThree} />
          </div>
        </div>
        <div className={classes.content}>
          <h1>Session</h1>
          <div className={classes.subHeading}>
            <h3>Active Session</h3>
            <button onClick={handleCreate}>create new</button>
          </div>
          <div className={classes.sessionContainer}>
            {sessions &&
              sessions.map(({ session }, idx) => (
                <div className={`${classes.sessionWrapper} ${dropdownId === idx && classes.active}`}>
                  <div key={idx} className={classes.session}>
                    <div className={classes.detail}>
                      <div className={classes.plan}>
                        <div className={classes.planName}>{session.currentPlan}</div>
                        <div className={classes.planFlag}>paid</div>
                      </div>
                      <div className={classes.collectionName}>{session.collectionName}</div>
                    </div>
                    <div className={classes.action}>
                      <div
                        onClick={() => handleLoad(session.sessionId, session.currentPlan)}
                        className={classes.loadBtn}
                      >
                        Load <span>session</span>
                      </div>
                      <div onClick={() => handleDelete(session.sessionId)} className={classes.deleteBtn}>
                        Delete <span>session</span>
                      </div>
                      <div onClick={() => handleDropdown(idx)} className={classes.dropdownIconContainer}>
                        <ChevronIcon className={`${classes.dropdownIcon} ${dropdownId === idx && classes.active}`} />
                      </div>
                    </div>
                  </div>
                  <div className={`${classes.sessionDropdown} ${dropdownId === idx && classes.active}`}>
                    <div className={classes.cost}>
                      <div className={classes.title}>cost per session</div>
                      <div className={classes.amount}>${plans[session.currentPlan].price}</div>
                    </div>
                    <div className={classes.services}>
                      {plans[session.currentPlan].services.map(({ name, available }) => (
                        <div key={idx} className={classes.service}>
                          {available ? (
                            <MarkIcon className={classes.markIcon} />
                          ) : (
                            <CloseIcon className={classes.closeIcon} />
                          )}
                          <div className={classes.serviceName}>{name}</div>
                        </div>
                      ))}
                    </div>
                    <div className={classes.ugradeBtnContainer}>
                      <button>Upgrade plan</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Session;
