import { Outlet } from "react-router-dom";
import BottomPlayer from "../../components/pc/BottomPlayer";

export default () => {
  return (
    <div className="h-full flex flex-col">
      <div className="h-[env(titlebar-area-height,_33px)] bg-black hidden window-controls-overlay:block [app-region:drag]"></div>
      <div className="flex-1 overflow-auto">
        <Outlet></Outlet>
      </div>
      <BottomPlayer></BottomPlayer>
    </div>
  );
};
