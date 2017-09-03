import html from "./inny";
import { connect } from "./store";

import TitleScreen from "./TitleScreen";
import LevelSelect from "./LevelSelect";

function App(current_scene) {
  switch (current_scene) {
    case "TITLE_SCREEN":
      return TitleScreen();
    case "LEVEL_SELECT":
      return LevelSelect();
    default:
      return "";
  }
}

export default connect(
  state => state.current_scene
)(App);
