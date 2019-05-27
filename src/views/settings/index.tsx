import React from "react";

import View from "../../components/View";

import ApplicationDataCard from "./ApplicationDataCard";

import "./styles.scss";

const SettingsView = () => (
  <View.Container>
    <View.Header>Extension Settings</View.Header>
    <View.Body>
      <div className="settings-view__cards-container">
        <ApplicationDataCard />
      </div>
    </View.Body>
  </View.Container>
);

export default SettingsView;
