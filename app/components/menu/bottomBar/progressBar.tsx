import React from 'react';

type Props = {
  percent: number;
};

class ProgressBar extends React.Component<Props> {
  render() {
    return (
      <div
        style={{
          display: 'inline-block',
          position: 'absolute',
          top: '0',
          left: '0',
          width: `${this.props.percent}%`,
          maxWidth: '100% !important',
          height: '4px',
          boxShadow: '1px 1px 1px rgba(0,0,0,0.4)',
          borderRadius: '1px 1px 1px 1px',
          backgroundColor: '#4cd964',
        }}
      />
    );
  }
}

export default ProgressBar;
