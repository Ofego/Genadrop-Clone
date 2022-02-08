import axios from "axios";
import { getAlgoData } from "../utils/arc_ipfs";

export const getNftCollections = async collections => {
  let collectionArr = []
  for (let i = 0; i < collections.length; i++) {
    try {
      let collectionObj = {}
      collectionObj.name = collections[i].name
      collectionObj.price = collections[i].price
      collectionObj.owner = collections[i].owner
      collectionObj.description = collections[i].description
      let { data } = await axios.get(collections[i]['url'].replace('ipfs://', 'https://ipfs.io/ipfs/'));
      collectionObj.number_of_nfts = data.length
      let { params } = await getAlgoData(data[0])
      let response = await axios.get(params['url'].replace('ipfs://', 'https://ipfs.io/ipfs/'));
      collectionObj.image_url = response.data.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      collectionArr.push(collectionObj)
    } catch (error) {
      console.error('get collection result failed');
    }
  }
  return collectionArr
}

export const getNftCollection = async collection => {
  let nftArr = []
  let { data } = await axios.get(collection['url'].replace('ipfs://', 'https://ipfs.io/ipfs/'));
  for (let i = 0; i < data.length; i++) {
    try {
      let nftObj = {}
      nftObj.collection_name = collection.name
      nftObj.owner = collection.owner
      nftObj.price = collection.price
      let { params } = await getAlgoData(data[i])
      nftObj.algo_data = params
      let response = await axios.get(params['url'].replace('ipfs://', 'https://ipfs.io/ipfs/'));
      nftObj.ipfs_data = response.data
      nftObj.name = response.data.name;
      nftObj.image_url = response.data.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      nftArr.push(nftObj)
    } catch (error) {
      console.error(error);
    }
  }
  return nftArr
}

export const getNftData = async (collection, assetName) => {
  let collectionData = await getNftCollection(collection)
  return collectionData.find(asset => asset.name === assetName);
}

export const getImageSize = async img => {
  return new Promise(resolve => {
    const image = new Image();
    if(typeof(img) === "string"){
      image.src = img
    }else {
     image.src = URL.createObjectURL(img);
    }
    image.onload = () => {
      resolve({height: image.height, width: image.width});
    };
  })
}

export const handleImage = async props => {
  const { canvas, images, image } = props;
  const { height, width } = await getImageSize(image);
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  const ctx = canvas.getContext("2d");
  for (let img of images) {
    const image = await new Promise(resolve => {
      const image = new Image();
      image.src = URL.createObjectURL(img);
      image.onload = () => {
        resolve(image);
      };
    });
    image && ctx.drawImage(image, 0, 0, width, height);
  };
};

export const handleBlankImage = async props => {
  const { img, canvas } = props
  const { height, width } = await getImageSize(img);
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  const ctx = canvas.getContext("2d");
  const image = await new Promise(resolve => {
    const image = new Image();
    image.src = "/assets/blank.png";
    image.onload = () => {
      resolve(image);
    };
  });
  image && ctx.drawImage(image, 0, 0, width, height);
};