import { useEffect, useState, useRef, useContext } from "react";
import classes from "./create-guide.module.css";
import rightCtrl from "../../assets/ctrl-right.svg";
import leftCtrl from "../../assets/ctrl-left.svg";
import blankImage from "../../assets/blank.png";
import { GenContext } from "../../gen-state/gen.context";
import { setDidMout } from "../../gen-state/gen.actions";
import { guide } from "./create-guide-script";

const maxCount = Object.keys(guide).length;

const CreateGuide = ({ toggleGuide, setGuide }) => {
  const swipeRef = useRef();
  const swipeContainer = useRef();
  const cardRef1 = useRef();
  const cardRef2 = useRef();
  const cardRef3 = useRef();
  const cardRef4 = useRef();
  const cardRef5 = useRef();
  const cardRef6 = useRef();
  const sideRef = useRef();
  const { dispatch } = useContext(GenContext);
  const [swipeCount, setSwipeCount] = useState(1);
  const [swipeWidth, setSwipeWidth] = useState("");
  const [swipeHeight, setSwipeHeight] = useState(0);
  const [animate, setAnimate] = useState(false);

  const swipeRight = () => {
    setSwipeCount((sw) => (sw >= maxCount ? sw : sw + 1));
    if (swipeCount < maxCount) setAnimate(true);
  };

  const swipeLeft = () => {
    setSwipeCount((sw) => (sw <= 1 ? sw : sw - 1));
    if (swipeCount > 1) setAnimate(true);
  };

  const handleClose = () => {
    dispatch(setDidMout(true));
    setGuide(false);
    setSwipeCount(1);
  };

  useEffect(() => {
    const plays = {
      1: () => {
        cardRef1.current.autoplay = true;
        cardRef1.current.load();
      },
      2: () => {
        cardRef2.current.autoplay = true;
        cardRef2.current.load();
      },
      3: () => {
        cardRef3.current.autoplay = true;
        cardRef3.current.load();
      },
      4: () => {
        cardRef4.current.autoplay = true;
        cardRef4.current.load();
      },
      5: () => {
        cardRef5.current.autoplay = true;
        cardRef5.current.load();
      },
      6: () => {
        cardRef6.current.autoplay = true;
        cardRef6.current.load();
      },
    };
    plays[swipeCount]();
  }, [swipeCount, toggleGuide]);

  useEffect(() => {
    swipeRef.current.style.transform = `translateX(-${(swipeCount - 1) * swipeWidth}px)`;
  }, [swipeCount, swipeWidth]);

  useEffect(() => {
    cardRef1.current.style.width = `${swipeWidth}px`;
    cardRef2.current.style.width = `${swipeWidth}px`;
    cardRef3.current.style.width = `${swipeWidth}px`;
    cardRef4.current.style.width = `${swipeWidth}px`;
    cardRef5.current.style.width = `${swipeWidth}px`;
    cardRef6.current.style.width = `${swipeWidth}px`;
  }, [swipeWidth]);

  useEffect(() => {
    let sideVideos = sideRef.current;
    if (!sideVideos) return;
    for (let sv of sideVideos) {
      if (sv.className.includes("create-guide__2__6-5U6")) {
        sv.style.height = `${swipeHeight - 64}px`;
      } else {
        sv.style.height = `${swipeHeight - 32}px`;
      }
    }
  }, [swipeHeight]);

  useEffect(() => {
    const { width } = swipeContainer.current.getBoundingClientRect();
    setSwipeWidth(width);
    // const { height } = cardRef1.current.getBoundingClientRect();
    setSwipeHeight(300);

    window.addEventListener("resize", () => {
      const { width } = swipeContainer.current.getBoundingClientRect();
      setSwipeWidth(width);
      const { height } = cardRef1.current.getBoundingClientRect();
      setSwipeHeight(height);
    });

    let sideVideos = document.querySelectorAll(".vid");
    sideRef.current = sideVideos;

    sideVideos[0].onanimationend = () => {
      setAnimate(false);
    };
  }, []);

  return (
    <div className={`${classes.wrapper} ${toggleGuide && classes.active}`}>
      <div className={classes.mainContainer}>
        <div className={classes.closeBtn}>
          <button onClick={handleClose}>close</button>
        </div>

        <div className={classes.heading}>
          <h3>
            Welcome To Genadrop
            <span>
              , the easy and robust no-code art generating tool that gives you quality and unique art. Let's work you
              through
            </span>
          </h3>
          <p>{guide[swipeCount].title}</p>
        </div>

        <div className={classes.container}>
          <div className={`vid ${classes.leftSideCard} ${classes._2} ${animate && classes.active}`}>
            <video src={swipeCount <= 2 ? blankImage : guide[swipeCount - 2].vid} />
          </div>

          <div className={`vid ${classes.leftSideCard} ${animate && classes.active}`}>
            <video src={swipeCount <= 1 ? blankImage : guide[swipeCount - 1].vid} />
          </div>

          <div ref={swipeContainer} className={`${classes.swipeContainer} ${animate && classes.active}`}>
            <div ref={swipeRef} className={classes.cardContainer}>
              <video controls src={guide[1].vid} ref={cardRef1} className={classes.card}></video>
              <video controls src={guide[2].vid} ref={cardRef2} className={classes.card}></video>
              <video controls src={guide[3].vid} ref={cardRef3} className={classes.card}></video>
              <video controls src={guide[4].vid} ref={cardRef4} className={classes.card}></video>
              <video controls src={guide[5].vid} ref={cardRef5} className={classes.card}></video>
              <video controls src={guide[6].vid} ref={cardRef6} className={classes.card}></video>
            </div>
          </div>
          <div className={`vid ${classes.rightSideCard} ${animate && classes.active}`}>
            <video src={swipeCount >= maxCount ? blankImage : guide[swipeCount + 1].vid} />
          </div>
          <div className={`vid ${classes.rightSideCard} ${classes._2} ${animate && classes.active}`}>
            <video src={swipeCount >= maxCount - 1 ? blankImage : guide[swipeCount + 2].vid} />
          </div>
        </div>
        <div className={classes.indicatorContainer}>
          {Array(maxCount)
            .fill(null)
            .map((_, idx) => (
              <div key={idx} className={`${classes.indicator} ${swipeCount === idx + 1 && classes.active}`}>
                <div></div>
              </div>
            ))}
        </div>
        <div className={classes.control}>
          <img
            src={leftCtrl}
            alt=""
            onMouseDown={swipeLeft}
            className={`${classes.left} ${swipeCount > 1 && classes.active}`}
          />
          <img
            src={rightCtrl}
            alt=""
            onMouseDown={swipeRight}
            className={`${classes.right} ${swipeCount < maxCount && classes.active}`}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateGuide;