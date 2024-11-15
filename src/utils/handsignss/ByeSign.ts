import {
  Finger,
  FingerCurl,
  FingerDirection,
  GestureDescription,
} from "fingerpose";

// Define Bye gesture
export const byeSign = new GestureDescription("Bye");

// Thumb
byeSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
byeSign.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);
byeSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.75);
byeSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.75);

// Index
byeSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
byeSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
byeSign.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.75);
byeSign.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.75);

// Middle
byeSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
byeSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);
byeSign.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 0.75);
byeSign.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 0.75);

// Ring
byeSign.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
byeSign.addDirection(Finger.Ring, FingerDirection.VerticalUp, 1.0);
byeSign.addDirection(Finger.Ring, FingerDirection.DiagonalUpLeft, 0.75);
byeSign.addDirection(Finger.Ring, FingerDirection.DiagonalUpRight, 0.75);

// Pinky
byeSign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
byeSign.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 1.0);
byeSign.addDirection(Finger.Pinky, FingerDirection.DiagonalUpLeft, 0.75);
byeSign.addDirection(Finger.Pinky, FingerDirection.DiagonalUpRight, 0.75);
