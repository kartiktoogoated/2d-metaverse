import React, { useEffect, useMemo, useState } from "react";

const ASSET_BASE = "https://kartiktoogoated.s3.amazonaws.com/my-game-assets";

interface AvatarProps {
  x: number;              // Pixel position x
  y: number;              // Pixel position y
  isMoving: boolean;      // Determines which sprite sheet to use
  direction: "left" | "right"; // Flip sprite if left
}

export const RUN_SPRITE_URL  = `${ASSET_BASE}/RUN.png`;
export const IDLE_SPRITE_URL = `${ASSET_BASE}/IDLE.png`;

export const RUN_FRAMES     = 8;
export const IDLE_FRAMES    = 7;
export const FRAME_WIDTH    = 64;
export const FRAME_HEIGHT   = 64;
export const FRAME_INTERVAL = 120;

function Avatar({ x, y, isMoving, direction }: AvatarProps) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  // Preload sprite sheets
  useEffect(() => {
    const runImg = new Image();
    const idleImg = new Image();
    let loadedCount = 0;
    const onLoad = () => {
      loadedCount++;
      if (loadedCount === 2) setImagesLoaded(true);
    };
    runImg.src = RUN_SPRITE_URL;
    idleImg.src = IDLE_SPRITE_URL;
    runImg.onload = onLoad;
    idleImg.onload = onLoad;
  }, []);

  const spriteUrl = isMoving ? RUN_SPRITE_URL : IDLE_SPRITE_URL;
  const totalFrames = isMoving ? RUN_FRAMES : IDLE_FRAMES;
  const duration = totalFrames * FRAME_INTERVAL;
  const animationName = isMoving ? "runAnim" : "idleAnim";
  const animationStyle = `${animationName} ${duration}ms steps(${totalFrames}) infinite`;

  const innerStyle = useMemo(() => ({
      width: "100%",
      height: "100%",
      backgroundImage: `url(${spriteUrl})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: `${FRAME_WIDTH * totalFrames}px ${FRAME_HEIGHT}px`,
      imageRendering: "pixelated" as React.CSSProperties["imageRendering"],
      animation: animationStyle,
      willChange: "background-position",
      ...(direction === "left" && {
        transform: "scaleX(-1)",
        transformOrigin: "center",
      }),
  }), [spriteUrl, totalFrames, animationStyle, direction]);

  const wrapperStyle = {
    position: "absolute" as const,
    top: y,
    left: x,
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
  };

  if (!imagesLoaded) {
    return <div style={{ ...wrapperStyle, backgroundColor: "#000" }} />;
  }

  return (
    <div style={wrapperStyle}>
      <div style={innerStyle} />
    </div>
  );
}

export default React.memo(Avatar);
