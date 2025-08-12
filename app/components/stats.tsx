import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import StatsWindowStore from 'app/stores/window/stats';

import YAHOO from 'app/shims/yahoo';

const StatsWindow = function () {
  useEffect(() => {
    if (StatsWindowStore.shown) {
      YAHOO.lacuna.Stats.show();
    }
  }, [StatsWindowStore.shown]);

  return <div />;
};

export default observer(StatsWindow);
