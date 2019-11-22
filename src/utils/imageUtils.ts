import ChromeIcon from "../assets/chrome-icon.png";
import EdgeIcon from "../assets/edge-icon.png";
import FirefoxIcon from "../assets/firefox-icon.png";
import OperaIcon from "../assets/opera-icon.png";

const IS_EDGE = navigator.userAgent.toLowerCase().includes("edg/");
const IS_FIREFOX = navigator.userAgent.toLowerCase().includes("firefox/");
const IS_OPERA = navigator.userAgent.toLowerCase().includes("opr/");

export function getBrowserFavIconUrl(): string {
  if (IS_FIREFOX) {
    return FirefoxIcon;
  }
  if (IS_EDGE) {
    return EdgeIcon;
  }
  if (IS_OPERA) {
    return OperaIcon;
  }

  return ChromeIcon;
}
