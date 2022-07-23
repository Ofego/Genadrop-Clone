import React, { useContext, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { GenContext } from "../../../gen-state/gen.context";
import { getSingleNftDetails } from "../../../utils";
import classes from "./listed.module.css";
import telegram from "../../assets/telegram.svg";
import twitterIcon from "../../assets/icon-twitter.svg";
import facebookIcon from "../../assets/facebook.svg";
import linktree from "../../assets/linktree.svg";

const Listed = () => {
  // const { account, connector } = useContext(GenContext);

  const {
    params: { nftId },
  } = useRouteMatch();
  const { singleNfts } = useContext(GenContext);

  const [state, setState] = useState({
    isLoading: true,
  });
  const { nftDetails, isLoading } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  useEffect(() => {
    const nft = singleNfts.filter((singleNft) => String(singleNft.id) === nftId)[0];

    (async function getNftDetails() {
      const nftdetails = await getSingleNftDetails(nft);

      handleSetState({ nftDetails: nftdetails, isLoading: false });
    })();
    document.documentElement.scrollTop = 0;
  }, []);

  if (isLoading) {
    return (
      <div className={classes.menu}>
        <div className={classes.left}>
          <Skeleton count={1} height={200} />
          <br />
          <Skeleton count={1} height={40} />
          <br />
          <Skeleton count={1} height={40} />
        </div>

        <div className={classes.right}>
          <Skeleton count={1} height={200} />
          <br />
          <Skeleton count={1} height={40} />
          <br />
          <Skeleton count={1} height={40} />
        </div>

        <div className={classes.fullLegnth}>
          <Skeleton count={1} height={200} />
          <br />
          <Skeleton count={1} height={200} />
        </div>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <span>Your item is now listed for sale</span>
      <img className={classes.nft} src={nftDetails.image_url} alt="" />

      <div className={classes.feature}>
        <div className={classes.mainDetails}>
          <div className={classes.collectionHeader}>
            <div className={classes.nftId}>Enable Email Notification</div>
          </div>
        </div>

        <div className={classes.detailContent}>
          <div className={classes.priceDescription}>
            Enter your email address in your account settings so we can let you know, when your listing sells or
            receives offers
          </div>
          <button type="button" className={classes.buy}>
            Profile Settings
          </button>
        </div>
      </div>

      <div className={classes.feature}>
        <div className={classes.mainDetails}>
          <div className={classes.collectionHeader}>
            <div className={classes.nftId}>Share your listing</div>
          </div>
        </div>

        <div className={classes.detailContent}>
          <img src={twitterIcon} alt="" />
          <img src={facebookIcon} alt="" />
          <img src={telegram} alt="" />
          <img src={linktree} alt="" />
        </div>
      </div>
      <button type="button" className={classes.view}>
        View Item
      </button>
    </div>
  );
};

export default Listed;
