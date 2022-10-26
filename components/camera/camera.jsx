import { useEffect, useRef, useState } from "react";

const Camera = () => {
  const videoRef = useRef();
  const photoRef = useRef();

  const [hasPhoto, setHasPhoto] = useState();
  const [selectedResolution, setSelectedResolution] = useState("FHD");
  const [isFacingMode, setIsFacingMode] = useState(false);

  const screenResolution = new Map([
    ["4K", { width: 3840, height: 2160 }],
    ["2K", { width: 2560, height: 1440 }],
    ["FHD", { width: 1920, height: 1080 }],
    ["HD", { width: 1280, height: 720 }],
    ["SD", { width: 720, height: 480 }],
  ]);

  class Constraints {
    constructor(videoWidth, videoHeight) {
      this.audio = true;
      this.video = {
        width: videoWidth,
        height: videoHeight,
        facingMode: "user",
      };
    }

    setFrameRate = (frameRate) => {
      this.video.frameRate = { ideal: frameRate, max: frameRate + 10 };
    };

    setFacingMode = (isFront) => {
      if (isFront) {
        console.log(isFront);
        this.video.facingMode = "user";
      } else {
        this.video.facingMode = { exact: "environment" };
      }
    };

    setRatio = (ratio) => {
      const currentRatio = screenResolution.get(ratio);

      this.video.width = currentRatio.width;
      this.video.height = currentRatio.height;
    };

    getRatio = () => {
      return {
        width: this.video.width,
        height: this.video.height,
      };
    };
  }

  // video config
  const constraints = new Constraints();
  constraints.setRatio(selectedResolution);

  // 이벤트 핸들러
  const ratioButtonBoxClickHandler = (e) => {
    const selected = e.target.textContent; // 선택한 화질
    if (selected) {
      const selectedWidth = screenResolution.get(selected).width;
      const currentWidth = constraints.video.width;

      console.log(selectedWidth, currentWidth);

      if (currentWidth !== selectedWidth) {
        setSelectedResolution(selected);
        constraints.setRatio(selectedResolution);
      }
    }
  };

  const resolutionSelectionButtons = [];
  for (let r of screenResolution) {
    const button = <button key={r[0]}>{r[0]}</button>;
    resolutionSelectionButtons.push(button);
  }

  const facingButtons = (
    <div
      className="facingButtonBox"
      onClick={(e) => {
        if (e.target.textContent) {
          const isFacing = Boolean(e.target.dataset.facing);
          constraints.setFacingMode(isFacing);
          setIsFacingMode(isFacing);
        }
      }}
    >
      <button data-facing={true}>전면</button>
      <button>후면</button>
    </div>
  );

  // 비디오 시작
  const getVideo = (constraints) => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const takePhoto = () => {
    const { width, height } = screenResolution?.get(selectedResolution);

    if (width) {
      console.log(screenResolution.get(selectedResolution));

      let video = videoRef.current;
      let photo = photoRef.current;

      photo.width = width;
      photo.height = height;

      let ctx = photo.getContext("2d");
      ctx.drawImage(video, 0, 0, width, height);
      setHasPhoto(true);
    }
  };

  const closePhoto = () => {
    let photo = photoRef.current;

    let ctx = photo.getContext("2d");
    ctx.clearRect(0, 0, photo.width, photo.height);
    setHasPhoto(false);
  };

  useEffect(() => {
    getVideo(constraints);
    console.log(constraints);
  }, [videoRef, constraints, hasPhoto]);

  return (
    <>
      <div className="camera">
        <video ref={videoRef}></video>
        <button className="takePhotoBtn" onClick={takePhoto}>
          찰칵
        </button>
      </div>

      <h1 className="title">Camera : {selectedResolution}</h1>

      <div className="ratioButtonBox" onClick={ratioButtonBoxClickHandler}>
        {resolutionSelectionButtons}
      </div>

      {facingButtons}

      <div className={`photo result ${hasPhoto ? "hasPhoto" : ""}`}>
        <canvas ref={photoRef}></canvas>
        {hasPhoto && (
          <>
            <button className="closePhotoBtn" onClick={closePhoto}>
              닫기
            </button>
            <button className="closePhotoBtn" onClick={closePhoto}>
              저장
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Camera;
