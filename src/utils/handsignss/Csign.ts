import {
  Finger,
  FingerCurl,
  FingerDirection,
  GestureDescription,
} from "fingerpose";

// Tạo mô tả cho cử chỉ chữ "C"
export const cSign = new GestureDescription("C");

// Ngón cái (cuộn nửa)
cSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
cSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 1.0);
cSign.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 1.0);

// Ngón trỏ (cuộn nửa, hướng lên trên chéo)
cSign.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);
cSign.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 1.0);
cSign.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 1.0);

// Ngón giữa (cuộn nửa, hướng lên trên chéo)
cSign.addCurl(Finger.Middle, FingerCurl.HalfCurl, 1.0);
cSign.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 1.0);
cSign.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 1.0);

// Ngón áp út (cuộn nửa, hướng lên trên chéo)
cSign.addCurl(Finger.Ring, FingerCurl.HalfCurl, 1.0);
cSign.addDirection(Finger.Ring, FingerDirection.DiagonalUpRight, 1.0);
cSign.addDirection(Finger.Ring, FingerDirection.DiagonalUpLeft, 1.0);

// Ngón út (cuộn nửa, hướng lên trên chéo)
cSign.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 1.0);
cSign.addDirection(Finger.Pinky, FingerDirection.DiagonalUpRight, 1.0);
cSign.addDirection(Finger.Pinky, FingerDirection.DiagonalUpLeft, 1.0);
