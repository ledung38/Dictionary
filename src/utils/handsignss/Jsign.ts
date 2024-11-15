import {
  Finger,
  FingerCurl,
  FingerDirection,
  GestureDescription,
} from "fingerpose";

export const jSign = new GestureDescription("J");
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
jSign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
jSign.addDirection(Finger.Pinky, FingerDirection.HorizontalLeft, 0.75);
jSign.addDirection(Finger.Pinky, FingerDirection.HorizontalRight, 0.75);

for (let finger of [Finger.Thumb, Finger.Index, Finger.Middle, Finger.Ring]) {
  jSign.addCurl(finger, FingerCurl.FullCurl, 1.0);
  jSign.addDirection(finger, FingerDirection.HorizontalLeft, 0.75);
  jSign.addDirection(finger, FingerDirection.HorizontalRight, 0.75);
}
