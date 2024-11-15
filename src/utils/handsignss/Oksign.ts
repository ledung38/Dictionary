//@ts-ignore
import fp from "fingerpose";
const { Finger, FingerCurl, FingerDirection, GestureDescription } = fp;

// describe ok gesture 👌
export const okSign = new GestureDescription("Ok");

// thumb:
okSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
okSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.75);

// index:
okSign.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);
okSign.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.75);

// Middle:
okSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
okSign.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 0.75);
// Gesture.addDirection(Finger.Middle, FingerDirection.VerticalUp, .25);

// Ring:
okSign.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
okSign.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.75);
// Gesture.addDirection(Finger.Ring, FingerDirection.DiagonalUpRight, .25);

// Pinky:
okSign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
okSign.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.75);
// Gesture.addDirection(Finger.Pinky, FingerDirection.DiagonalUpRight, .25);
