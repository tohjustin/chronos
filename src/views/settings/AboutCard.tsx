import React from "react";

import packageInfo from "../../../package.json";
import Card from "../../components/Card";
import ExternalLink from "../../components/ExternalLink";
import { List, ListItem } from "../../components/List";

import { parseRepositoryInfo } from "./utils";

const AboutCard = () => {
  const buildNumber = process.env.REACT_APP_GIT_COMMIT_SHA;
  const repoInfo = parseRepositoryInfo(packageInfo.repository);

  return (
    <Card
      className="settings-view__card settings-view__card--md"
      title="About"
      description="Extension build & project information"
      body={
        <List className="settings-view__list">
          <ListItem label="Release Version" value={packageInfo.version} />
          <ListItem label="Build Number" value={buildNumber} />
          <ListItem
            label="Project Homepage"
            value={<ExternalLink url={packageInfo.homepage} />}
          />
          <ListItem
            label="Project Repository"
            value={
              <ExternalLink iconSrc={repoInfo.vcsIconSrc} url={repoInfo.url}>
                {repoInfo.label}
              </ExternalLink>
            }
          />
        </List>
      }
    />
  );
};

export default AboutCard;
