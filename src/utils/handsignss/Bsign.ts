// gestures.js
import {
  Finger,
  FingerCurl,
  FingerDirection,
  GestureDescription,
} from "fingerpose";

// Define the "B" gesture
export const bSign = new GestureDescription("B");

// Thumb
bSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
bSign.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);

// Index
bSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
bSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);

// Middle
bSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
bSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);

// Ring
bSign.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
bSign.addDirection(Finger.Ring, FingerDirection.VerticalUp, 1.0);

// Pinky
bSign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
bSign.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 1.0);

export default bSign;
