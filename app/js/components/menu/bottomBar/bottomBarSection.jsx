'use strict';

var PropTypes = require('prop-types');

var React = require('react');
var classnames = require('classnames');

var ProgressBar = require('js/components/menu/bottomBar/progressBar');

var BottomBarSection = React.createClass({
    propTypes: {
        iconName: PropTypes.string.isRequired,
        topText: PropTypes.string.isRequired,
        bottomText: PropTypes.string.isRequired,
        toolTipShow: PropTypes.func,
        progressPercent: PropTypes.number,
    },

    handleToolTip: function() {
        if (typeof this.props.toolTipShow === 'function') {
            this.props.toolTipShow();
        }
    },

    render: function() {
        return (
            <div className='item' onMouseEnter={this.handleToolTip}>
                {this.props.progressPercent ? (
                    <ProgressBar percent={this.props.progressPercent} />
                ) : (
                    ''
                )}

                <i
                    className={classnames(this.props.iconName, 'large icon')}
                ></i>

                <p
                    style={{
                        margin: 0,
                    }}
                >
                    {this.props.topText}
                </p>

                {this.props.bottomText}
            </div>
        );
    },
});

module.exports = BottomBarSection;
