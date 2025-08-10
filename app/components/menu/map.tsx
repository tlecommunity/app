import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import BodyRPCStore from 'app/stores/rpc/body';
import MenuStore, { PLANET_MAP_MODE, STAR_MAP_MODE } from 'app/stores/menu';
import LegacyHooks from 'app/legacyHooks';

// TODO: factor out all this glue code

const Map = function () {
  const [previousMapMode, setPreviousMapMode] = useState(PLANET_MAP_MODE);
  const [previousPlanetId, setPreviousPlanetId] = useState(-1);

  useEffect(() => {
    // Do nothing if the menu isn't shown.
    if (MenuStore.menuShown === false) {
      // Reset these values because we're *probably* logged out.
      setPreviousMapMode(PLANET_MAP_MODE);
      setPreviousPlanetId(-1);
    }

    if (!MenuStore.planetId) {
      return;
    }

    console.log('Rendering map');
    console.log(`mapMode = ${MenuStore.mapMode} (previous: ${previousMapMode})`);
    console.log(`planet = ${MenuStore.planetId} (previous: ${previousPlanetId})`);

    if (
      // Render if the planet id has changed... OR...
      (previousPlanetId !== MenuStore.planetId ||
        // Render if we've changed from the starMap to the planetMap
        (previousMapMode !== MenuStore.mapMode && MenuStore.mapMode === PLANET_MAP_MODE)) &&
      MenuStore.planetId !== -1
    ) {
      LegacyHooks.loadPlanet(MenuStore.planetId, MenuStore.mapMode === STAR_MAP_MODE);
      setPreviousPlanetId(MenuStore.planetId);
      setPreviousMapMode(MenuStore.mapMode);
    } else if (MenuStore.mapMode !== previousMapMode && MenuStore.mapMode === STAR_MAP_MODE) {
      LegacyHooks.loadStarmap(BodyRPCStore.x, BodyRPCStore.y);
      setPreviousPlanetId(MenuStore.planetId);
      setPreviousMapMode(MenuStore.mapMode);
    }
  }, [MenuStore.planetId, MenuStore.mapMode]);

  return <div />;
};

export default observer(Map);
