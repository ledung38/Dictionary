import {
  Finger,
  FingerCurl,
  FingerDirection,
  GestureDescription,
} from "fingerpose";

// Tạo mô tả cho cử chỉ chữ "H"
export const hSign = new GestureDescription("H");

// Ngón trỏ (không cuộn, hướng ngang)
hSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
hSign.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 1.0);
hSign.addDirection(Finger.Index, FingerDirection.HorizontalRight, 1.0);

// Ngón giữa (không cuộn, hướng ngang)
hSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
hSign.addDirection(Finger.Middle, FingerDirection.HorizontalLeft, 1.0);
hSign.addDirection(Finger.Middle, FingerDirection.HorizontalRight, 1.0);

// Ngón cái, ngón áp út, và ngón út (cuộn hoàn toàn)
for (let finger of [Finger.Thumb, Finger.Ring, Finger.Pinky]) {
  hSign.addCurl(finger, FingerCurl.FullCurl, 1.0);
  hSign.addDirection(finger, FingerDirection.HorizontalLeft, 0.75);
  hSign.addDirection(finger, FingerDirection.HorizontalRight, 0.75);
}
