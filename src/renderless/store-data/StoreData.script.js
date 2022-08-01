import {
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
  listAll,
  getDownloadURL,
  getMetadata,
  uploadString,
} from "firebase/storage";
import { doc, collection, setDoc, getFirestore, getDoc, getDocs, query, deleteDoc } from "firebase/firestore";

import { app } from "../../utils/firebase";

const storage = getStorage(app);
const firestore = getFirestore();

export const saveSession = async ({ currentUser, sessionId, collectionName, currentPlan }) => {
  if (currentUser && sessionId && collectionName) {
    const docRef = doc(firestore, `users/${currentUser.uid}/sessions/${sessionId}`);
    setDoc(docRef, {
      session: {
        collectionName,
        sessionId,
        currentPlan,
      },
    });
    return sessionId;
  }
};

export const saveCollectionName = async ({ currentUser, sessionId, collectionName }) => {
  if (currentUser && sessionId) {
    const docRef = doc(firestore, `users/${currentUser.uid}/collectionName/${sessionId}`);
    setDoc(docRef, { collectionName });
  }
};

export const saveLayers = ({ currentUser, sessionId, layers }) => {
  if (currentUser && sessionId) {
    const docRef = doc(firestore, `users/${currentUser.uid}/layers/${sessionId}`);
    setDoc(docRef, { layers });
  }
};

export const saveNftLayers = ({ currentUser, sessionId, nftLayers, nftTraits }) => {
  if (currentUser && sessionId && nftLayers.length) {
    const docRef = doc(firestore, `users/${currentUser.uid}/nftLayers/${sessionId}`);
    setDoc(docRef, { nftLayers });
    // save the layer trait to storage
    nftTraits.forEach(async ({ id, image }, idx) => {
      const nftTraitRef = ref(storage, `${currentUser.uid}/nftLayers/${sessionId}/${id}`);
      try {
        await uploadString(nftTraitRef, image, "data_url");
      } catch (error) {
        console.log(`error ${error}`);
      }
    });
  }
};

export const saveTraits = async ({ currentUser, sessionId, id, traits }) => {
  if (!traits.length) return;
  if (currentUser && sessionId) {
    traits.forEach(async ({ traitTitle, image }) => {
      const traitRef = ref(storage, `${currentUser.uid}/${sessionId}/${id}/${traitTitle}`);
      try {
        await uploadBytes(traitRef, image);
        console.log({ traitTitle });
      } catch (error) {
        console.log(`error ${error}`);
      }
    });
  }
};

export const renameTrait = async ({ currentUser, sessionId, id, oldName, newName, image }) => {
  if (currentUser && sessionId) {
    const traitRef = ref(storage, `${currentUser.uid}/${sessionId}/${id}/${newName}`);
    // upload the new file
    try {
      await uploadBytes(traitRef, image);
    } catch (error) {
      console.log(`error ${error}`);
    }
    const deleteRef = ref(storage, `${currentUser.uid}/${sessionId}/${id}/${oldName}`);
    // Delete the old file
    try {
      await deleteObject(deleteRef);
    } catch (error) {
      console.log(`error ${error}`);
    }
  }
};

export const deleteAllLayers = async ({ currentUser, sessionId }) => {
  const res = await fetchNftLayers({ currentUser, sessionId });
  res &&
    res.nftLayers.forEach(async (layer) => {
      await deleteAllNftTraits({ currentUser, sessionId, id: layer.id });
    });
  const { layers } = await fetchLayers({ currentUser, sessionId });
  layers.forEach(async (layer) => {
    await deleteAllTraits({ currentUser, sessionId, id: layer.id });
  });
  await deleteDoc(doc(firestore, `users/${currentUser.uid}/sessions/${sessionId}`));
  await deleteDoc(doc(firestore, `users/${currentUser.uid}/collectionName/${sessionId}`));
  await deleteDoc(doc(firestore, `users/${currentUser.uid}/layers/${sessionId}`));
  await deleteDoc(doc(firestore, `users/${currentUser.uid}/nftLayers/${sessionId}`));
};

export const deleteTrait = async ({ currentUser, sessionId, id, traitTitle }) => {
  if (currentUser && sessionId) {
    const deleteRef = ref(storage, `${currentUser.uid}/${sessionId}/${id}/${traitTitle}`);
    try {
      await deleteObject(deleteRef);
    } catch (error) {
      console.log(`error ${error}`);
    }
  }
};

export const deleteAllTraits = async ({ currentUser, sessionId, id }) => {
  if (currentUser && sessionId) {
    const listRef = ref(storage, `${currentUser.uid}/${sessionId}/${id}`);
    const res = await listAll(listRef);
    const folder = await Promise.all(
      res.items.map(async (folderRef) => {
        // All the folder under listRef.
        return folderRef;
      })
    );
    folder.forEach(async (ref) => {
      try {
        await deleteObject(ref);
      } catch (error) {
        console.log(`error ${error}`);
      }
    });
  }
};

export const deleteAllNftTraits = async ({ currentUser, sessionId, id }) => {
  if (currentUser && sessionId) {
    const listRef = ref(storage, `${currentUser.uid}/nftLayers/${sessionId}/${id}`);
    const res = await listAll(listRef);
    const folder = await Promise.all(
      res.items.map(async (folderRef) => {
        return folderRef;
      })
    );
    folder.forEach(async (ref) => {
      try {
        await deleteObject(ref);
      } catch (error) {
        console.log(`nftLayers error ${error}`);
      }
    });
  }
};

export const fetchSession = async ({ currentUser }) => {
  if (currentUser) {
    const q = query(collection(firestore, `users/${currentUser.uid}/sessions`));
    const querySnapshot = await getDocs(q);
    const sessions = [];
    querySnapshot.forEach((doc) => {
      sessions.push(doc.data());
    });
    return sessions;
  }
};

export const fetchCollectionName = async ({ currentUser, sessionId }) => {
  if (currentUser && sessionId) {
    const querySnapshot = query(doc(firestore, `users/${currentUser.uid}/collectionName/${sessionId}`));
    const docSnapshot = await getDoc(querySnapshot);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.log("collectionName does not exist");
    }
  }
};

export const fetchLayers = async ({ currentUser, sessionId }) => {
  if (currentUser && sessionId) {
    const querySnapshot = query(doc(firestore, `users/${currentUser.uid}/layers/${sessionId}`));
    const docSnapshot = await getDoc(querySnapshot);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.log("layers does not exist");
    }
  }
};

export const fetchNftLayers = async ({ currentUser, sessionId }) => {
  if (currentUser && sessionId) {
    const querySnapshot = query(doc(firestore, `users/${currentUser.uid}/nftLayers/${sessionId}`));
    const docSnapshot = await getDoc(querySnapshot);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.log("nftLayers does not exist");
    }
  }
};

export const fetchTraits = async ({ currentUser, sessionId }) => {
  if (currentUser && sessionId) {
    const listRef = ref(storage, `${currentUser.uid}/${sessionId}/`);
    const traitRef = await listAll(listRef);
    // Find all the prefixes and items.
    const getFiles = async (fileRef) => {
      const res = await listAll(fileRef);
      let key = null;
      const files = await Promise.all(
        res.items.map(async (itemRef) => {
          // All the items under listRef.
          let file = {};
          try {
            const url = await getDownloadURL(ref(storage, itemRef));
            file.url = url;
            const metadata = await getMetadata(itemRef);
            file.metadata = metadata;
            key = metadata.fullPath.split("/")[2];
            return file;
          } catch (error) {
            console.log(error);
          }
        })
      );
      return { [key]: files };
    };
    const folders = await Promise.all(
      traitRef.prefixes.map(async (folderRef) => {
        // All the folders under listRef.
        return folderRef;
      })
    );
    return await Promise.all(folders.map(async (ref) => await getFiles(ref)));
  }
};

export const fetchNftTraits = async ({ currentUser, sessionId }) => {
  if (currentUser && sessionId) {
    const listRef = ref(storage, `${currentUser.uid}/nftLayers/${sessionId}/`);
    // Find all the prefixes and items.
    const res = await listAll(listRef);
    const nftTraits = {};
    await Promise.all(
      res.items.map(async (itemRef) => {
        // All the items under listRef.
        let file = {};
        try {
          const url = await getDownloadURL(ref(storage, itemRef));
          file.url = url;
          const metadata = await getMetadata(itemRef);
          file.metadata = metadata;
          const key = metadata.fullPath.split("/")[3];
          nftTraits[key] = file;
          return null;
        } catch (error) {
          console.log(error);
        }
      })
    );
    return nftTraits;
  }
};

export const getFile = async (url, name, type) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], name, { type });
    return file;
  } catch (error) {
    console.log(error);
  }
};

export const getBase64FromUrl = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
};

const transfromTraits = async (value) => {
  const newTraits = {};
  await Promise.all(
    value.map(async (traitObj) => {
      let newTrait = null;
      await Promise.all(
        Object.values(traitObj).map(async (trait) => {
          newTrait = await Promise.all(
            trait.map(async ({ url, metadata: { name, contentType } }) => await getFile(url, name, contentType))
          );
          return null;
        })
      );
      newTraits[Object.keys(traitObj)] = [...newTrait];
      return null;
    })
  );
  return newTraits;
};

const transfromNftTraits = async (value) => {
  let newTrait = {};
  await Promise.all(
    Object.keys(value).map(async (key) => {
      const { url } = value[key];
      const file = await getBase64FromUrl(url);
      newTrait[key] = file;
      return null;
    })
  );
  return newTrait;
};

export const fetchUserSession = async ({ currentUser, sessionId }) => {
  console.log("fetching");
  try {
    const result = await Promise.all([
      fetchCollectionName({ currentUser, sessionId }),
      fetchLayers({ currentUser, sessionId }),
      fetchTraits({ currentUser, sessionId }),
      fetchNftLayers({ currentUser, sessionId }),
      fetchNftTraits({ currentUser, sessionId }),
    ]);
    const [storedCollectionName, storedLayers, storedTraits, storedNftLayers, storedNftTraits] = result;
    const transformedTraits = await transfromTraits(storedTraits);
    const newLayers = constructLayers({ storedLayers, transformedTraits });
    let newNftLayers = [];
    if (storedNftLayers) {
      const transformedNftTraits = await transfromNftTraits(storedNftTraits);
      newNftLayers = constructNftLayers({ storedNftLayers, transformedNftTraits });
    }
    console.log({
      storedCollectionName,
      storedLayers,
      storedTraits,
      storedNftLayers,
      storedNftTraits,
      newNftLayers,
      newLayers,
    });

    return {
      nftLayers: newNftLayers,
      layers: newLayers,
      collectionName: storedCollectionName.collectionName,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const constructLayers = ({ storedLayers, transformedTraits }) => {
  return storedLayers.layers.map(({ traits, id, ...otherLayerProps }) => {
    const obj = transformedTraits[id];
    const newTraits = traits.map(({ image, traitTitle, ...otherTraitProps }) => {
      let file = null;
      for (let o of obj) {
        if (o.name === traitTitle) {
          file = o;
          break;
        }
      }
      return { image: file, traitTitle, ...otherTraitProps };
    });
    return { traits: newTraits, id, ...otherLayerProps };
  });
};

export const constructNftLayers = ({ storedNftLayers, transformedNftTraits }) => {
  return storedNftLayers.nftLayers.map(({ id, image, ...otherLayerProps }) => {
    const file = transformedNftTraits[id];
    return { id, image: file, ...otherLayerProps };
  });
};
