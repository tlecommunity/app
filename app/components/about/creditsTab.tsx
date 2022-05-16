import React from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';

import CreditsRPCStore from 'app/stores/rpc/stats/credits';
import StatsService from 'app/services/stats';

import CreditsSection from 'app/components/about/creditsSection';

class CreditsTab extends React.Component {
  componentDidMount() {
    StatsService.getCredits();
  }

  render() {
    return (
      <div>
        <h1>Credits</h1>

        {_.map(CreditsRPCStore.credits, (names, header) => (
          <CreditsSection key={header} header={header} names={names} />
        ))}
      </div>
    );
  }
}

export default observer(CreditsTab);