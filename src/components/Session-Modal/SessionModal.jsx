import classes from "./SessionModal.module.css";
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";
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

const SessionModal = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

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

  const handleClose = () => {
    dispatch(setToggleSessionModal(false));
  };

  return (
    <div className={`${classes.container} ${toggleSessionModal && classes.active}`}>
      <div className={classes.wrapper}>
        <div className={` ${classes.loader} ${loading && classes.active}`}>
          <div className={classes.dots}>
            <div>Loading</div>
            <div className={classes.dotOne} />
            <div className={classes.dotTwo} />
            <div className={classes.dotThree} />
          </div>
        </div>
        <CloseIcon onClick={handleClose} className={classes.closeBtn} />
        <div className={classes.content}>
          <h1>Sessions</h1>
          <div className={classes.sessionContainer}>
            {sessions &&
              sessions.map(({ session }, idx) => (
                <div key={idx} className={classes.session}>
                  <div className={classes.detail}>
                    <div className={classes.name}>{session.collectionName}</div>
                    {/* <div className={classes.edited}>Last edited</div> */}
                  </div>
                  <div className={classes.action}>
                    <div onClick={() => handleLoad(session.sessionId, session.currentPlan)} className={classes.loadBtn}>
                      Load
                    </div>
                    <div onClick={() => handleDelete(session.sessionId)} className={classes.deleteBtn}>
                      Delete
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <button onClick={handleCreate}>New Collection</button>
        </div>
      </div>
    </div>
  );
};

export default SessionModal;
