import JSZip from "jszip";


export const getAweaveFormat = async (nftLayers) => {
  let clone = [];
  for (let i = 0; i < nftLayers.length; i++) {
    clone.push({
      name: nftLayers[i].name ? nftLayers[i].name : `_${i}`,
      image: "image.png",
      description: nftLayers[i].description,
      attributes: nftLayers[i].attributes.map(({ trait_type, value, rarity }) => (
        { trait_type, value, rarity }
      )),
      symbol: '',
      seller_fee_basis_points: '',
      external_url: "",
      collection: {
        name: nftLayers[i].name ? nftLayers[i].name : `_${i}`,
        family: ""
      },
      properties: {
        creators: [
          {
            address: "",
            share: 100
          }
        ]
      }
    })
  }
  return clone;
}

export const getIpfsFormat = async (nftLayers) => {
  let clone = [];
  for (let i = 0; i < nftLayers.length; i++) {
    clone.push({
      name: nftLayers[i].name ? nftLayers[i].name : `_${i}`,
      image: "image.png",
      description: nftLayers[i].description,
      attributes: nftLayers[i].attributes.map(({ trait_type, value, rarity }) => (
        { trait_type, value, rarity }
      ))
    })
  }
  return clone;
}

export const paginate = (input, count) => {
  let countPerPage = count;
  let numberOfPages = Math.ceil(input.length / countPerPage);
  let startIndex = 0;
  let endIndex = startIndex + countPerPage;
  let paginate = {}
  for (let i = 1; i <= numberOfPages; i++) {
    paginate[i] = input.slice(startIndex, endIndex);
    startIndex = endIndex;
    endIndex = startIndex + countPerPage
  }
  return paginate
}

export const downloadCallback = async props => {
  const { value, outputFormat } = props;

  const zip = new JSZip();
  if (outputFormat.toLowerCase() === "arweave") {
    const aweave = await getAweaveFormat(value);
    aweave.forEach((data, idx) => {
      zip.file(data.name ? `${data.name}.json` : `_${idx}.json`, JSON.stringify(data, null, '\t'));
    });
  } else {
    zip.file("metadata.json", JSON.stringify(await getIpfsFormat(value), null, '\t'));
  }
  for (let i = 0; i < value.length; i++) {
    let base64String = value[i].image.replace("data:image/png;base64,", "");
    zip.file(value[i].name ? `${value[i].name}.png` : `_${i}.png`, base64String, { base64: true });
  }
  return await zip.generateAsync({ type: "blob" });
}
