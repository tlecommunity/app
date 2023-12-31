import PropTypes from 'prop-types';

import React from 'react';

class BuildButton extends React.Component {
  static propTypes = {
    canBuild: PropTypes.number.isRequired,
    obj: PropTypes.object.isRequired,
    buildingId: PropTypes.number.isRequired,
    autoSelect: PropTypes.string.isRequired,
    fleetType: PropTypes.string.isRequired,
  };

  handleQuantity = (o) => {
    const quantity = this.refs.quantity.value;

    ShipyardRPCActions.requestShipyardRPCBuildFleet({
      building_ids: [this.props.buildingId],
      type: this.props.fleetType,
      quantity,
      autoselect: this.props.autoSelect,
    });
  };

  render() {
    if (!this.props.canBuild) {
      return <div />;
    }

    return (
      <div className='ui fluid action input'>
        <input type='text' placeholder='Qty.' ref='quantity' />
        <div className='ui green button' onClick={this.handleQuantity}>
          Build
        </div>
      </div>
    );
  }
}

export default BuildButton;
