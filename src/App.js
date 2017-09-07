import html from "innerself";
import { connect } from "./store";

import TitleScreen from "./TitleScreen";
import LevelSelect from "./LevelSelect";
import FindScreen from "./FindScreen";
import ScoreScreen from "./ScoreScreen";
import PlayOverlay from "./PlayOverlay";

const scenes = {
  "SCENE_TITLE": TitleScreen,
  "SCENE_LEVELS": LevelSelect,
  "SCENE_FIND": FindScreen,
  "SCENE_SCORE": ScoreScreen,
  "SCENE_PLAY": PlayOverlay,
};

function App({scene}) {
  const component = scenes[scene];
  return component ? component() : "";
}

export default connect(App);
