import ChromeIcon from "../assets/chrome-icon.png";
import EdgeIcon from "../assets/edge-icon.png";
import FirefoxIcon from "../assets/firefox-icon.png";
import OperaIcon from "../assets/opera-icon.png";

const USER_AGENT = navigator.userAgent.toLowerCase();

export const IS_EDGE = USER_AGENT.includes("edg/");
export const IS_FIREFOX = USER_AGENT.includes("firefox/");
export const IS_OPERA = USER_AGENT.includes("opr/");
export const IS_SAFARI =
  USER_AGENT.includes("safari/") && !USER_AGENT.includes("chrome/");
export const IS_CHROME =
  USER_AGENT.includes("chrome/") &&
  !(IS_EDGE || IS_FIREFOX || IS_OPERA || IS_SAFARI);

export const IS_CHROMIUM = IS_CHROME || IS_EDGE || IS_OPERA;

export function getBrowserFavIconUrl(): string {
  if (IS_EDGE) {
    return EdgeIcon;
  }
  if (IS_FIREFOX) {
    return FirefoxIcon;
  }
  if (IS_OPERA) {
    return OperaIcon;
  }

  return ChromeIcon;
}
