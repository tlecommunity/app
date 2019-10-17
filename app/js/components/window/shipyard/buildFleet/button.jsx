'use strict';

var PropTypes = require('prop-types');

var React = require('react');

var ShipyardRPCActions = require('js/actions/rpc/shipyard');

var BuildButton = React.createClass({
    propTypes: {
        canBuild: PropTypes.number.isRequired,
        obj: PropTypes.object.isRequired,
        buildingId: PropTypes.number.isRequired,
        autoSelect: PropTypes.string.isRequired,
        fleetType: PropTypes.string.isRequired,
    },

    handleQuantity: function(o) {
        var quantity = this.refs.quantity.value;

        ShipyardRPCActions.requestShipyardRPCBuildFleet({
            building_ids: [this.props.buildingId],
            type: this.props.fleetType,
            quantity: quantity,
            autoselect: this.props.autoSelect,
        });
    },

    render: function() {
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
    },
});

module.exports = BuildButton;
