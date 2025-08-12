import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import MailWindowStore from 'app/stores/window/mail';

import YAHOO from 'app/shims/yahoo';

const MailWindow = function () {
  useEffect(() => {
    if (MailWindowStore.shown) {
      YAHOO.lacuna.Messaging.show();
    }
  }, [MailWindowStore.shown]);

  return <div />;
};

export default observer(MailWindow);
