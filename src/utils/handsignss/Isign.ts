import {
  Finger,
  FingerCurl,
  FingerDirection,
  GestureDescription,
} from "fingerpose";

export const iSign = new GestureDescription("I");
// [
//     [
//       "Thumb",
//       "Half Curl",
//       "Diagonal Up Left"
//     ],
//     [
//       "Index",
//       "Full Curl",
//       "Vertical Up"
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
//       "No Curl",
//       "Vertical Up"
//     ]
//   ]

//Thumb
iSign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
iSign.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 1.0);

for (let finger of [Finger.Thumb, Finger.Index, Finger.Middle, Finger.Ring]) {
  iSign.addCurl(finger, FingerCurl.FullCurl, 1.0);
  iSign.addDirection(finger, FingerDirection.HorizontalLeft, 0.75);
  iSign.addDirection(finger, FingerDirection.HorizontalRight, 0.75);
}
