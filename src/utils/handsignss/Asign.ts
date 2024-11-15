// gestures.js
import {
  Finger,
  FingerCurl,
  FingerDirection,
  GestureDescription,
} from "fingerpose";

// Define the "A" gesture
export const aSign = new GestureDescription("A");

// Tất cả ngón tay đều uốn cong
for (let finger of [
  Finger.Thumb,
  Finger.Index,
  Finger.Middle,
  Finger.Ring,
  Finger.Pinky,
]) {
  aSign.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

export default aSign;
