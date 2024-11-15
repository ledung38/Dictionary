// gestures.js
import {
  Finger,
  FingerCurl,
  FingerDirection,
  GestureDescription,
} from "fingerpose";

// Define the "S" gesture
export const sSign = new GestureDescription("S");

// Thumb
sSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
sSign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);
sSign.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);

// Index
sSign.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
sSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);

// Middle
sSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
sSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);

// Ring
sSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
sSign.addDirection(Finger.Ring, FingerDirection.VerticalUp, 1.0);

// Pinky
sSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
sSign.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 1.0);

export default sSign;
