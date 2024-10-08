import { useState } from "react";
import Joinroom from "./Joinroom/Joinroom";
import Room from "./Room";

export type wind = {
  name: string;
  room: string;
  users: number;
};

const App = () => {
  const [win, setWin] = useState<wind>({ name: "", room: "", users: 0 });
  return (
    <div>
      {win.users > 0 ? (
        <Room setWin={setWin} win={win} />
      ) : (
        <Joinroom setWin={setWin} />
      )}
    </div>
  );
};

export default App;
