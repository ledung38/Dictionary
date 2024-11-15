import {
  Finger,
  FingerCurl,
  FingerDirection,
  GestureDescription,
} from "fingerpose";

export const iLoveYouSign = new GestureDescription("I LOVE YOU");

// Thumb
iLoveYouSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
iLoveYouSign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.7);
iLoveYouSign.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.7);

// Index
iLoveYouSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
iLoveYouSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 1);

// Middle
iLoveYouSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1);
iLoveYouSign.addDirection(Finger.Middle, FingerDirection.VerticalDown, 0.7);

// Ring
iLoveYouSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
iLoveYouSign.addDirection(Finger.Ring, FingerDirection.VerticalDown, 0.7);

// Pinky
iLoveYouSign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
iLoveYouSign.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 1);
