import React from "react";

import View from "../../components/View";

import AboutCard from "./AboutCard";
import ExtensionDataCard from "./ExtensionDataCard";

import "./styles.scss";

const SettingsView = () => (
  <View.Container>
    <View.Header>Extension Settings</View.Header>
    <View.Body>
      <div className="settings-view__cards-container">
        <ExtensionDataCard />
        <AboutCard />
      </div>
    </View.Body>
  </View.Container>
);

export default SettingsView;
