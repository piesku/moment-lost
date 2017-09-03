import html from "./inny";
import { connect } from "./store";

import TitleScreen from "./TitleScreen";
import LevelSelect from "./LevelSelect";
import FindScreen from "./FindScreen";

function App(current_scene) {
  switch (current_scene) {
    case "SCENE_TITLE":
      return TitleScreen();
    case "SCENE_LEVELS":
      return LevelSelect();
    case "SCENE_FIND":
      return FindScreen();
    case "SCENE_PLAY":
    default:
      return "";
  }
}

export default connect(
  state => state.current_scene
)(App);
