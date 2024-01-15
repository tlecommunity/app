import React from 'react';
import _ from 'lodash';
import { Building } from 'app/interfaces';
import { types } from '@tlecommunity/client';
import FleetItem from 'app/components/spacePort/fleetItem';
import lacuna from 'app/lacuna';

type Props = {
  building: Building;
};

type State = {
  fleets: types.SpacePort.Fleet[];
  fleetCount: number;
  shipCount: number;
};

class TravellingFleetsTab extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { fleets: [], fleetCount: 0, shipCount: 0 };
  }

  async componentDidMount() {
    const { result } = await lacuna.spacePort.viewTravellingFleets({
      building_id: this.props.building.id,
    });
    if (result) {
      this.setState({
        fleets: result.travelling,
        fleetCount: result.number_of_fleets_travelling,
        shipCount: result.number_of_ships_travelling,
      });
    }
  }

  render() {
    return (
      <div className='bulma'>
        <div className='block'>
          Number of fleets: {this.state.fleetCount}, number of ships: {this.state.shipCount}
        </div>
        <div>
          {_.map(this.state.fleets, (fleet) => (
            <FleetItem fleet={fleet} key={fleet.id} />
          ))}
        </div>
      </div>
    );
  }
}

export default TravellingFleetsTab;
