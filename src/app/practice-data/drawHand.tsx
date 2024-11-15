// Finger joints definition
const fingerJoints: { [key: string]: number[] } = {
  thumb: [0, 1, 2, 3, 4],
  index: [0, 5, 6, 7, 8],
  mid: [0, 9, 10, 11, 12],
  ring: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

// Type definitions for hand landmarks
interface Landmark {
  x: number;
  y: number;
  z: number;
}

interface Prediction {
  landmarks: [number, number, number][];
}

// Drawing function
export const drawHand = (
  predictions: Prediction[],
  ctx: CanvasRenderingContext2D,
): void => {
  // Check the prediction
  if (predictions.length > 0) {
    // Loop through the predictions
    predictions.forEach((prediction) => {
      // Grab landmarks
      const landmarks = prediction.landmarks;

      // Loop through the finger joints
      for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
        const finger = Object.keys(fingerJoints)[j];
        for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
          const firstJointIndex = fingerJoints[finger][k];
          const secondJointIndex = fingerJoints[finger][k + 1];

          // Draw joints
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

      // Loop through landmarks and draw them
      for (let i = 0; i < landmarks.length; i++) {
        // Get x point
        const x = landmarks[i][0];

        // Get y point
        const y = landmarks[i][1];

        // Start drawing
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 3 * Math.PI);

        // Set line color
        ctx.fillStyle = "navy";
        ctx.fill();
      }
    });
  }
};
