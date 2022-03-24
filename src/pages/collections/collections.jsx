import { useEffect, useRef, useState } from 'react';
import classes from './collections.module.css';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { getNftCollections } from '../../utils';
import CollectionsCard from '../../components/Marketplace/collectionsCard/collectionsCard';
import { getPolygonNfts } from '../../utils/arc_ipfs';
import { chainIcon, transformArrayOfArraysToArrayOfObjects } from './collection-script';
import { fetchCollections } from '../../utils/firebase';
import dropdownIcon from '../../assets/icon-dropdown.svg';
import axios from 'axios';
import arrowDown from '../../assets/icon-arrow-down-long.svg';
import arrowUp from '../../assets/icon-arrow-up-long.svg';

const Collections = () => {
  const domMountRef = useRef(false);

  const [state, setState] = useState({
    togglePriceFilter: false,
    toggleChainFilter: false,
    filteredCollection: [],
    algoCollection: null,
    polyCollection: null,
    celoCollection: null,
    nearCollection: null,
    filter: {
      searchValue: '',
      price: 'high',
      chain: 'Algorand'
    }
  });

  const {
    algoCollection,
    polyCollection,
    celoCollection,
    nearCollection,
    filter,
    togglePriceFilter,
    toggleChainFilter,
    filteredCollection
  } = state;

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const getCollectionToFilter = () => {
    switch (filter.chain) {
      case 'Algorand':
        return algoCollection
      case 'Polygon':
        return polyCollection
      case 'Celo':
        return celoCollection
      case 'Near':
        return nearCollection
      default:
        break;
    }
  }

  useEffect(() => {
    try {
      (async function getAlgoCollection() {
        let collections = await fetchCollections();
        let result = await getNftCollections(collections)
        handleSetState({ algoCollection: result })
      }())
    } catch (error) {
      console.log(error);
    }

    try {
      (async function getPolygonCollection() {
        const result = await getPolygonNfts();
        let data = transformArrayOfArraysToArrayOfObjects(result);
        console.log('data: ', data);
        for (let d of data) {
          let response = await axios.get(d['url'].replace('ipfs://', 'https://ipfs.io/ipfs/'));
          console.log('response', response);
        }
        // handleSetState({ polyCollection: result });
        // console.log(result);
      }())
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (!algoCollection) return;
    let filtered = algoCollection.filter(col => {
      return col.name.toLowerCase().includes(filter.searchValue.toLowerCase());
    });
    handleSetState({ filteredCollection: filtered });
  }, [filter.searchValue]);

  useEffect(() => {
    if (!algoCollection) return;
    let filtered = null;
    if (filter.price === "low") {
      filtered = algoCollection.sort((a, b) => Number(a.price) - Number(b.price))
    } else {
      filtered = algoCollection.sort((a, b) => Number(b.price) - Number(a.price))
    }
    handleSetState({ filteredCollection: filtered });
  }, [filter.price]);

  useEffect(() => {
    if (domMountRef.current) {
      console.log('mounted');
      let filteredCollection = getCollectionToFilter();
      handleSetState({ filteredCollection })
    } else {
      domMountRef.current = true;
    }
    console.log('dom');
  }, [filter.chain, algoCollection, polyCollection, celoCollection, nearCollection]);

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.header}>
          <h1 >Collections</h1>
          <div className={classes.searchAndPriceFilter}>
            <input
              type="search"
              onChange={event => handleSetState({ filter: { ...filter, searchValue: event.target.value } })}
              value={filter.searchValue}
              placeholder='search'
            />

            <div className={classes.chainDropdown}>
              <div onClick={() => handleSetState({ toggleChainFilter: !toggleChainFilter, togglePriceFilter: false })} className={classes.selectedChain}>
                <div>
                  <img src={chainIcon[filter.chain]} alt="" />
                  <span>{filter.chain}</span>
                </div>
                <img src={dropdownIcon} alt="" className={`${classes.dropdownIcon} ${toggleChainFilter && classes.active}`} />
              </div>
              <div className={`${classes.dropdown} ${toggleChainFilter && classes.active}`}>
                <div onClick={() => handleSetState({ filter: { ...filter, chain: 'Algorand' }, toggleChainFilter: false })}>
                  <img src={chainIcon.Algorand} alt="" />
                  <span>Algorand</span>
                </div>
                <div onClick={() => handleSetState({ filter: { ...filter, chain: 'Polygon' }, toggleChainFilter: false })}>
                  <img src={chainIcon.Polygon} alt="" />
                  <span>Polygon</span>
                </div>
                <div onClick={() => handleSetState({ filter: { ...filter, chain: 'Near' }, toggleChainFilter: false })}>
                  <img src={chainIcon.Near} alt="" />
                  <span>Near</span>
                </div>
                <div onClick={() => handleSetState({ filter: { ...filter, chain: 'Celo' }, toggleChainFilter: false })}>
                  <img src={chainIcon.Celo} alt="" />
                  <span>Celo</span>
                </div>
              </div>
            </div>

            <div className={classes.priceDropdown}>
              <div onClick={() => handleSetState({ togglePriceFilter: !togglePriceFilter, toggleChainFilter: false })} className={classes.selectedPrice}>
                Price{filter.price === 'low' ? <span>Low to High</span> : <span>High to Low</span>}
                <img src={dropdownIcon} alt="" className={`${classes.dropdownIcon} ${togglePriceFilter && classes.active}`} />
              </div>
              <div className={`${classes.dropdown} ${togglePriceFilter && classes.active}`}>
                <div onClick={() => handleSetState({ filter: { ...filter, price: 'low' }, togglePriceFilter: false })}>
                  price <span>Low to High</span> <img src={arrowUp} alt="" /></div>
                <div onClick={() => handleSetState({ filter: { ...filter, price: 'high' }, togglePriceFilter: false })}>
                  price <span>High to Low</span> <img src={arrowDown} alt="" /></div>
              </div>
            </div>
          </div>
        </div>

        {
          filteredCollection?.length ?
            <div className={classes.wrapper}>
              {
                filteredCollection
                  .map((collection, idx) => (
                    <CollectionsCard key={idx} collection={collection} />
                  ))
              }
            </div>
            :
            !filteredCollection
              ?
              <div className={classes.noResult}>no result found</div>
              :
              <div className={classes.skeleton}>
                {
                  (Array(4).fill(null)).map((_, idx) => (
                    <div key={idx}>
                      <Skeleton count={1} height={250} />
                      <br />
                      <Skeleton count={1} height={30} />
                      <br />
                      <Skeleton count={1} height={30} />
                    </div>
                  ))
                }
              </div>
        }
      </div>
    </div>
  )
}

export default Collections