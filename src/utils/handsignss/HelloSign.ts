import {
  Finger,
  FingerCurl,
  FingerDirection,
  GestureDescription,
} from "fingerpose";

// Tạo mô tả cho cử chỉ "Hello"
export const helloSign = new GestureDescription("Hello");

// Ngón cái (không cuộn)
helloSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
helloSign.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);
helloSign.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);

// Ngón trỏ (không cuộn)
helloSign.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
helloSign.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 1.0);
helloSign.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 1.0);

// Ngón giữa (không cuộn)
helloSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
helloSign.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 1.0);
helloSign.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 1.0);

// Ngón áp út (không cuộn)
helloSign.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
helloSign.addDirection(Finger.Ring, FingerDirection.DiagonalUpLeft, 1.0);
helloSign.addDirection(Finger.Ring, FingerDirection.DiagonalUpRight, 1.0);

// Ngón út (không cuộn)
helloSign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
helloSign.addDirection(Finger.Pinky, FingerDirection.DiagonalUpLeft, 1.0);
helloSign.addDirection(Finger.Pinky, FingerDirection.DiagonalUpRight, 1.0);

// Chỉ hướng lòng bàn tay ra ngoài
helloSign.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 0.5);
helloSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.5);
helloSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.5);
helloSign.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.5);
helloSign.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.5);
