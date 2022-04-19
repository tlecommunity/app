import React from 'react';

import AboutTab from 'app/js/components/window/about/aboutTab';
import CreditsTab from 'app/js/components/window/about/creditsTab';

import { Tabs, Tab } from 'app/js/components/tabber';

import WindowsStore from 'app/js/stores/windows';

class AboutWindow extends React.Component {
    static options = {
        title: 'About',
        width: 450,
        height: 400,
    };

    closeWindow() {
        WindowsStore.close('about');
    }

    render() {
        return (
            <Tabs>
                <Tab title='About'>
                    <AboutTab />
                </Tab>

                <Tab title='Credits'>
                    <CreditsTab />
                </Tab>
            </Tabs>
        );
    }
}

export default AboutWindow;
