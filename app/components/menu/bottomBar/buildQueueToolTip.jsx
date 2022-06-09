import PropTypes from 'prop-types';

import React from 'react';

class RPCCountToolTip extends React.Component {
  static propTypes = {
    body: PropTypes.object.isRequired,
  };

  render() {
    if (this.props.body.type === 'space station') {
      return (
        <div>
          How many modules are queued to be built. Space stations do not have a build queue limit.
        </div>
      );
    }
    return (
      <div>
        How many{' '}
        <a target='_new' href='http://community.lacunaexpanse.com/wiki/development-ministry'>
          buildings are or can be queued.
        </a>
        .
      </div>
    );
  }
}

export default RPCCountToolTip;