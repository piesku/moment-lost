import { connect } from "./store";

import TitleScreen from "./TitleScreen";
import IntroScreen from "./IntroScreen";
import FindScreen from "./FindScreen";
import PlayOverlay from "./PlayOverlay";
import ScoreScreen from "./ScoreScreen";
import LevelSelect from "./LevelSelect";

const scenes = {
  "SCENE_TITLE": TitleScreen,
  "SCENE_INTRO": IntroScreen,
  "SCENE_FIND": FindScreen,
  "SCENE_PLAY": PlayOverlay,
  "SCENE_SCORE": ScoreScreen,
  "SCENE_LEVELS": LevelSelect,
};

function App({current_scene}) {
  const component = scenes[current_scene];
  return component ? component() : "";
}

export default connect(App);
