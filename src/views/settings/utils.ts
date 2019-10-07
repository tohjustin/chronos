import BitbucketIcon from "../../assets/bitbucket-icon.png";
import GithubIcon from "../../assets/github-icon.png";
import GitlabIcon from "../../assets/gitlab-icon.png";

/**
 * Converts number of bytes into human-readable format (up to GB)
 * @param bytes Number of bytes to convert
 * @param fractionDigits Number of digits after the decimal point.
 * Must be in the range 0 - 20, inclusive.
 * @returns number of bytes in human-readable format
 */
export function formatBytes(bytes: number, fractionDigits = 2) {
  switch (true) {
    case bytes < 1024:
      return bytes + " Bytes";
    case bytes < 1048576:
      return (bytes / 1024).toFixed(fractionDigits) + " KB";
    case bytes < 1073741824:
      return (bytes / 1048576).toFixed(fractionDigits) + " MB";
    default:
      return (bytes / 1073741824).toFixed(fractionDigits) + " GB";
  }
}

/**
 * Converts distance between two dates into human-readable format
 * @param startDate start date in milliseconds
 * @param endDate end date in milliseconds
 * @returns distance between two dates in human-readable format
 */
export function formatDateDistance(startDate: number, endDate: number): string {
  let result = "";
  const distanceInNearestMins = Math.floor((endDate - startDate) / 1000 / 60);
  if (distanceInNearestMins > 0 && distanceInNearestMins < 60) {
    return "Less than a minute";
  }

  const days = Math.floor(distanceInNearestMins / 60 / 24);
  const hours = Math.floor(distanceInNearestMins / 60) % 24;
  const minutes = distanceInNearestMins % 60;

  if (days > 0) {
    result += `${days} ${days > 1 ? "days" : "day"}`;
    if (hours > 0 || minutes > 0) {
      result += ", ";
    }
  }
  if (hours > 0) {
    result += `${hours} ${hours > 1 ? "hours" : "hour"}`;
    if (minutes > 0) {
      result += " ";
    }
  }
  if (minutes > 0) {
    result += `${minutes} ${minutes > 1 ? "minutes" : "minute"}`;
  }

  return result;
}

/**
 * Parse the `repository` field data in `package.json` & returns relevant
 * information about the repository & the inferred VCS provider.
 *
 * Current supported VCS:
 * - [Bitbucket](https://bitbucket.org)
 * - [GitHub](https://github.com)
 * - [GitLab](https://gitlab.com)
 *
 * @param repositoryInfo `package.json`'s `repository` field
 * @returns repository & VCS provider information
 */
export function parseRepositoryInfo(repositoryInfo: {
  type: string;
  url: string;
}): {
  url: string;
  vcsIconSrc?: string;
  label?: string;
} {
  if (repositoryInfo.type === "git") {
    let result;
    result = repositoryInfo.url.match(
      /https:\/\/github\.com\/([^/]+)\/([^/]+)\.git/
    );
    if (result) {
      const [, owner, repository] = result;
      return {
        label: `${owner}/${repository}`,
        url: `https://github.com/${owner}/${repository}`,
        vcsIconSrc: GithubIcon
      };
    }
    result = repositoryInfo.url.match(
      /https:\/\/gitlab\.com\/([^/]+)\/([^/]+)\.git/
    );
    if (result) {
      const [, namespace, projectName] = result;
      return {
        label: `${namespace}/${projectName}`,
        url: `https://gitlab.com/${namespace}/${projectName}`,
        vcsIconSrc: GitlabIcon
      };
    }
    result = repositoryInfo.url.match(
      /https:\/\/.*bitbucket\.org\/([^/]+)\/([^/]+)\.git/
    );
    if (result) {
      const [, username, repoSlug] = result;
      return {
        label: `${username}/${repoSlug}`,
        url: `https://bitbucket.org/${username}/${repoSlug}`,
        vcsIconSrc: BitbucketIcon
      };
    }
  }

  return { url: repositoryInfo.url };
}
