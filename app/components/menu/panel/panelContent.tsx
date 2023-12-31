import PropTypes from 'prop-types';

import React from 'react';
import environment from 'app/environment';

type Props = {
  panelHeight: number | 'auto';
  panelWidth: number;
  children: React.ReactNode;
};

class PanelContent extends React.Component<Props> {
  static propTypes = {
    panelHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    panelWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    children: PropTypes.element,
  };

  render() {
    return (
      <div
        style={{
          overflow: 'auto',
          width: this.props.panelWidth,
          border: '2px solid black',
          background: `#0268AC url(${environment.getAssetsUrl()}ui/bkg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'top left',
          borderRadius: '10px',
          padding: '10px',
        }}
      >
        <div
          style={{
            overflow: 'auto',
            overflowX: 'hidden',
            height: this.props.panelHeight,
            padding: '5px',
            boxSizing: 'border-box',
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default PanelContent;
