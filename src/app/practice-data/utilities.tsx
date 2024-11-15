interface Landmark {
  0: number;
  1: number;
}

interface Prediction {
  landmarks: Landmark[];
}

const fingerJoints: { [key: string]: number[] } = {
  thumb: [0, 1, 2, 3, 4],
  index: [0, 5, 6, 7, 8],
  mid: [0, 9, 10, 11, 12],
  ring: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

//drawing function
export const drawHand = (
  predictions: Prediction[],
  ctx: CanvasRenderingContext2D,
): void => {
  //check the predictions
  if (predictions.length > 0) {
    //loop through the predictions
    predictions.forEach((prediction) => {
      //grab landmarks
      const landmarks = prediction.landmarks;

      //loop through the finger joints
      for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
        let finger = Object.keys(fingerJoints)[j];
        for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
          const firstJointIndex = fingerJoints[finger][k];
          const secondJointIndex = fingerJoints[finger][k + 1];

          //draw joints
          ctx.beginPath();
          ctx.moveTo(
            landmarks[firstJointIndex][0],
            landmarks[firstJointIndex][1],
          );
          ctx.lineTo(
            landmarks[secondJointIndex][0],
            landmarks[secondJointIndex][1],
          );
          ctx.strokeStyle = "gold";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      //loop through landmarks and draw them
      for (let i = 0; i < landmarks.length; i++) {
        //get x point
        const x = landmarks[i][0];

        //get y point
        const y = landmarks[i][1];

        //start drawing
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 3 * Math.PI);

        //set line color
        ctx.fillStyle = "navy";
        ctx.fill();
      }
    });
  }
};
