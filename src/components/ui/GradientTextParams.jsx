import GradientText from "./GradientText";

// For a smoother animation, the gradient should start and end with the same color

import React from "react";

function GradientTextParams() {
  return (
    <>
      <GradientText
        colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
        animationSpeed={8}
        showBorder={false}
        className="custom-class"
      ></GradientText>
    </>
  );
}

export default GradientTextParams;
