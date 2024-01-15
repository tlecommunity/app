import React from 'react';
import _ from 'lodash';
import lacuna from 'app/lacuna';
import { BodyDetailsWindowOptions } from 'app/interfaces/window';
import { types } from '@tlecommunity/client';
type Fleet = types.SpacePort.Fleet;
import FleetItem from 'app/components/spacePort/fleetItem';

type Props = {
  options: BodyDetailsWindowOptions;
};

type State = {
  fleets: Fleet[];
};

class OrbitingFleetsTab extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fleets: [],
    };
  }

  async componentDidMount() {
    const { result } = await lacuna.spacePort.viewOrbitingFleets({
      target: { body_id: this.props.options.id },
    });
    if (result) {
      this.setState({ fleets: result.orbiting });
    }
  }

  render() {
    return (
      <div>
        {_.map(this.state.fleets, (fleet) => (
          <FleetItem fleet={fleet} key={fleet.id} />
        ))}
      </div>
    );
  }
}

export default OrbitingFleetsTab;
