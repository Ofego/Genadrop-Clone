import { GoogleAuthProvider, getAuth, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { setCurrentUser, setIsUser, setNotification } from "../../gen-state/gen.actions";

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const signInWithGoogle = ({ dispatch }) => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const { displayName, email, uid } = result.user;
      dispatch(setCurrentUser({ displayName, email, uid }));
    })
    .catch((error) => {
      console.log(error);
      dispatch(
        setNotification({
          type: "error",
          message: "something went wrong",
        })
      );
    });
};

export const getCurrentUser = ({ dispatch }) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const { displayName, email, uid } = user;
      dispatch(setCurrentUser({ displayName, email, uid }));
      dispatch(setIsUser("true"));
    } else {
      dispatch(setIsUser("false"));
    }
  });
};

export const logOut = ({ history, dispatch }) => {
  signOut(auth)
    .then(() => {
      dispatch(setCurrentUser(null));
      history.push("/");
    })
    .catch((error) => {
      console.log(error);
    });
};