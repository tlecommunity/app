import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import OptionsWindowStore from 'app/stores/window/options';

import YAHOO from 'app/shims/yahoo';

const OptionsWindow = function () {
  useEffect(() => {
    if (OptionsWindowStore.shown) {
      YAHOO.lacuna.Profile.show();
    }
  }, [OptionsWindowStore.shown]);

  return <div />;
};

export default observer(OptionsWindow);
