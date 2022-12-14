import axios from "axios";
import { getAlgoData } from "../utils/arc_ipfs";
import { readSIngleUserNft } from "../utils/firebase";
// import fileDownload from 'js-file-download'
import fileDownload from 'js-file-download'

import worker from 'workerize-loader!../worker'; // eslint-disable-line import/no-webpack-loader-syntax

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
      let { asset: { params} } = await getAlgoData(data[0])
      let response = await axios.get(params['url'].replace('ipfs://', 'https://ipfs.io/ipfs/'));
      collectionObj.image_url = response.data.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      collectionArr.push(collectionObj)
    } catch (error) {
      console.log(error);
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
      let { asset: { params} } = await getAlgoData(data[i])
      nftObj.algo_data = params
      nftObj.Id = data[i]
      let response = await axios.get(params['url'].replace('ipfs://', 'https://ipfs.io/ipfs/'));
      let assetInfo = await readSIngleUserNft(collection.owner, data[i])
      nftObj.sold = assetInfo.sold
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

export const getUserNftCollection = async data => {
  let nftArr = []
  for (let i = 0; i < data.length; i++) {
    try {
      let nftObj = {}
      nftObj.collection_name = data[i].collection
      nftObj.price = data[i].price
      let { asset: { params} } = await getAlgoData(data[i].id)
      nftObj.algo_data = params
      nftObj.Id = data[i].id
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

export const getSingleNfts = async nfts => {
  let nftArr = []
  for (let i = 0; i < nfts.length; i++) {
    try {
      let nftObj = {}
      nftObj.Id = nfts[i].id
      nftObj.price = nfts[i].price
      nftObj.buyer = nfts[i].buyer
      nftObj.sold = nfts[i].sold
      nftObj.dateSold = nfts[i].dateSold
      nftObj.description = nfts[i].description
      let { asset: { params} } = await getAlgoData(nfts[i].id)
      let response = await axios.get(params['url'].replace('ipfs://', 'https://ipfs.io/ipfs/'));
      nftObj.image_url = response.data.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      nftObj.name = response.data.name
      nftObj.description = response.data.description
      nftArr.push(nftObj)
    } catch (error) {
      console.error('get collection result failed');
    }
  }
  return nftArr
}

export const getSingleNftDetails = async nft => {
  let nftDetails = {}
  try {
      nftDetails.Id = nft.id
      nftDetails.price = nft.price
      nftDetails.buyer = nft.buyer
      nftDetails.sold = nft.sold
      nftDetails.dateSold = nft.dateSold
      nftDetails.description = nft.description
      let { asset: { params} } = await getAlgoData(nft.id)
      let response = await axios.get(params['url'].replace('ipfs://', 'https://ipfs.io/ipfs/'));
      nftDetails.image_url = response.data.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      nftDetails.name = response.data.name
      nftDetails.description = response.data.description
    } catch (error) {
      console.error('get collection result failed');
    }
  return nftDetails
}

export const getNftData = async (collection, assetName) => {
  let collectionData = await getNftCollection(collection)
  return collectionData.find(asset => asset.name === assetName);
}

export const getImageSize = async img => {
  return new Promise(resolve => {
    const image = new Image();
    if (typeof (img) === "string") {
      image.src = img
    } else {
      image.src = URL.createObjectURL(img);
    }
    image.onload = () => {
      resolve({ height: image.height, width: image.width });
    };
  })
}

export const getDefaultName = id => {
  id = String(id);
  if (id.length < 4) {
    let repeatBy = 4 - id.length
    return `#${'0'.repeat(repeatBy)}${id}`
  } else {
    return `#${id}`
  }
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


export const getMockValue = async val => {
  const pickerOpts = {
    types: [
      {
        description: 'Images',
        accept: {
          'image/*': ['.png']
        }
      },
    ],
    excludeAcceptAllOption: true,
    multiple: false
  };

  async function getTheFile() {
    let [fileHandle] = await window.showOpenFilePicker(pickerOpts);
    const fileData = await fileHandle.getFile();
    return fileData
  }

  async function getBase64(file) {
    return new Promise(resolve => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result)
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    })
  }

  let value = Array(val).fill(
    {
      attributes: [
        {
          image: await getTheFile(),
          rarity: "1",
          trait_type: "a",
          value: "Red Lips.png"
        }
      ],
      description: " #0001",
      id: Date.now(),
      image: await getBase64(await getTheFile()),
      name: ""
    }
  );

  value = value.map((v, id) => ({ ...v, name: '#' + id, description: `description ${id + 1}` }))

  return value;
}

export const handleDownloadWithWorker = async props => {
  const { window, dispatch, setLoader, setNotification, value, name, outputFormat } = props;
  const mockValue = await getMockValue(500);
  const instance = worker()
  const content = await instance.downloadCallback({value: mockValue, name, outputFormat})
  fileDownload(content, `${'name' ? `${'name'}${true ? '' : `_${'id'}`}.zip` : 'collections.zip'}`);
}
