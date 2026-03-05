import ShinyText from "./ShinyText";

import React from "react";

function ShinyTextParams() {
  return (
    <>
      <ShinyText
        text="Try Playground "
        speed={2}
        delay={0}
        color="#b5b5b5"
        shineColor="#ffffff"
        spread={120}
        direction="left"
        yoyo={false}
        pauseOnHover={false}
        disabled={false}
      />
    </>
  );
}

export default ShinyTextParams;
