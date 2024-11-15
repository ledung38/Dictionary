import {
  Finger,
  FingerCurl,
  FingerDirection,
  GestureDescription,
} from "fingerpose";

export const thankYouSign = new GestureDescription("S");
// [
//     [
//       "Thumb",
//       "Half Curl",
//       "Vertical Up"
//     ],
//     [
//       "Index",
//       "Full Curl",
//       "Diagonal Up Right"
//     ],
//     [
//       "Middle",
//       "Full Curl",
//       "Vertical Up"
//     ],
//     [
//       "Ring",
//       "Full Curl",
//       "Vertical Up"
//     ],
//     [
//       "Pinky",
//       "Full Curl",
//       "Diagonal Up Left"
//     ]
//   ]

//Thumb
thankYouSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
thankYouSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 1);

//Index
thankYouSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1);
thankYouSign.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 1);

//Middle
thankYouSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1);
thankYouSign.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 1);

//Ring
thankYouSign.addCurl(Finger.Ring, FingerCurl.NoCurl, 1);
thankYouSign.addDirection(Finger.Ring, FingerDirection.DiagonalUpRight, 1);

//Pinky
thankYouSign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1);
thankYouSign.addDirection(Finger.Pinky, FingerDirection.DiagonalUpRight, 1);
