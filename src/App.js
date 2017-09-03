import html from "./inny";
import { connect } from "./store";

import TitleScreen from "./TitleScreen";
import LevelSelect from "./LevelSelect";
import FindScreen from "./FindScreen";
import ScoreScreen from "./ScoreScreen";
import PlayOverlay from "./PlayOverlay";

function App(current_scene) {
  switch (current_scene) {
    case "SCENE_TITLE":
      return TitleScreen();
    case "SCENE_LEVELS":
      return LevelSelect();
    case "SCENE_FIND":
      return FindScreen();
    case "SCENE_SCORE":
      return ScoreScreen();
    case "SCENE_PLAY":
      return PlayOverlay();
    default:
      return "";
  }
}

export default connect(
  state => state.current_scene
)(App);
