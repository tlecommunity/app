import Server from './server.js';
import Empire from './empire.js';
import moment from 'moment';
import { DATE_FORMAT } from './constants.js';

const Body = {
  get_buildings() {
    return {
      status: Body.get_status(),
      body: {
        surface_image: 'surface-p35',
      },
      buildings: {
        4965708: {
          efficiency: '100',
          name: 'Black Hole Generator',
          x: '1',
          image: 'blackholegenerator1',
          y: '4',
          level: '30',
          url: '/blackholegenerator',
        },
        4942253: {
          y: '4',
          efficiency: '100',
          level: '30',
          name: 'Water Storage Tank',
          url: '/waterstorage',
          x: '-3',
          image: 'waterstorage9',
        },
        4965699: {
          y: '4',
          efficiency: '100',
          level: '30',
          name: 'Pyramid Junk Sculpture',
          url: '/pyramidjunksculpture',
          x: '-5',
          image: 'pyramidjunksculpture1',
        },
        spacejunkpark: {
          y: '4',
          efficiency: '100',
          level: '30',
          name: 'Space Junk Park',
          url: '/spacejunkpark',
          x: '-4',
          image: 'spacejunkpark1',
        },
        arches: {
          y: '3',
          efficiency: '100',
          level: '30',
          name: 'Metal Junk Arches',
          url: '/metaljunkarches',
          x: '-5',
          image: 'metaljunkarches1',
        },
        henge: {
          y: '3',
          efficiency: '100',
          level: '30',
          name: 'Junk Henge',
          url: '/junkhengesculpture',
          x: '-4',
          image: 'junkhengesculpture1',
        },
        greatballofjunk: {
          y: '3',
          efficiency: '100',
          level: '30',
          name: 'Great Ball of Junk',
          url: '/greatballofjunk',
          x: '-3',
          image: 'greatballofjunk1',
        },
        panth: {
          y: '4',
          efficiency: '100',
          level: '30',
          name: 'Pantheon of Hagness',
          url: '/pantheonofhagness',
          x: '0',
          image: 'pantheonofhagness1',
        },
        temple: {
          y: '4',
          efficiency: '100',
          level: '30',
          name: 'Temple Of The Drajilites',
          url: '/templeofthedrajilites',
          x: '3',
          image: 'templedrajilites1',
        },
        essentiavein: {
          y: '3',
          efficiency: '100',
          level: '30',
          name: 'Essentia Vein',
          url: '/essentiavein',
          x: '2',
          image: 'essentiavein1',
        },
        4943197: {
          y: '2',
          efficiency: '100',
          level: '30',
          name: 'Intelligence Ministry',
          url: '/intelligence',
          x: '1',
          image: 'intelligence9',
        },
        4979713: {
          y: '0',
          efficiency: '25',
          level: '30',
          name: 'Shield Against Weapons',
          url: '/saw',
          x: '3',
          image: 'saw9',
        },
        4944689: {
          y: '-1',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-5',
          image: 'spaceport9',
        },
        4943183: {
          y: '-1',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '0',
          image: 'spaceport9',
        },
        4979712: {
          y: '0',
          efficiency: '50',
          level: '30',
          name: 'Shield Against Weapons',
          url: '/saw',
          x: '2',
          image: 'saw9',
        },
        4944680: {
          y: '5',
          efficiency: '100',
          level: '30',
          name: 'Interdimensional Rift',
          url: '/interdimensionalrift',
          x: '0',
          image: 'interdimensionalrift1',
        },
        4942254: {
          y: '4',
          efficiency: '100',
          level: '30',
          name: 'Energy Reserve',
          url: '/energyreserve',
          x: '-2',
          image: 'energy-reserve9',
        },
        4944683: {
          y: '4',
          efficiency: '100',
          level: '30',
          name: 'Crashed Ship Site',
          url: '/crashedshipsite',
          x: '-1',
          image: 'crashedshipsite1',
        },
        4948857: {
          efficiency: '100',
          name: 'Propulsion System Factory',
          x: '-2',
          image: 'propulsion9',
          y: '2',
          level: '30',
          url: '/propulsion',
        },
        4944213: {
          y: '5',
          efficiency: '100',
          level: '30',
          name: 'Archaeology Ministry',
          url: '/archaeology',
          x: '2',
          image: 'archaeology9',
        },
        4943640: {
          y: '5',
          efficiency: '100',
          level: '30',
          name: 'Geo Thermal Vent',
          url: '/geothermalvent',
          x: '-2',
          image: 'geothermalvent1',
        },
        4968807: {
          y: '3',
          efficiency: '100',
          level: '30',
          name: 'Entertainment District',
          url: '/entertainment',
          x: '-1',
          image: 'entertainment9',
        },
        4975914: {
          y: '-2',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-1',
          image: 'spaceport9',
        },
        4976222: {
          y: '-2',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-3',
          image: 'spaceport9',
        },
        4948858: {
          efficiency: '100',
          name: 'Pilot Training Facility',
          x: '-3',
          image: 'pilottraining9',
          y: '2',
          level: '30',
          url: '/pilottraining',
        },
        4943281: {
          y: '3',
          efficiency: '100',
          level: '30',
          name: 'Observatory',
          url: '/observatory',
          x: '-2',
          image: 'observatory9',
        },
        4942247: {
          y: '3',
          efficiency: '100',
          level: '30',
          name: 'University',
          url: '/university',
          x: '3',
          image: 'university9',
        },
        4944685: {
          y: '-1',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-1',
          image: 'spaceport9',
        },
        4944198: {
          efficiency: '100',
          name: 'Trade Ministry',
          x: '0',
          image: 'trade9',
          y: '2',
          level: '30',
          url: '/trade',
        },
        4943639: {
          y: '5',
          efficiency: '100',
          level: '30',
          name: 'Natural Spring',
          url: '/naturalspring',
          x: '-3',
          image: 'naturalspring1',
        },
        4944677: {
          y: '5',
          efficiency: '100',
          level: '30',
          name: 'Development Ministry',
          url: '/development',
          x: '1',
          image: 'devel9',
        },
        4979716: {
          y: '0',
          efficiency: '50',
          level: '30',
          name: 'Shield Against Weapons',
          url: '/saw',
          x: '5',
          image: 'saw9',
        },
        4979714: {
          y: '0',
          efficiency: '75',
          level: '30',
          name: 'Shield Against Weapons',
          url: '/saw',
          x: '4',
          image: 'saw9',
        },
        4943633: {
          y: '5',
          efficiency: '100',
          level: '30',
          name: 'Volcano',
          url: '/volcano',
          x: '-4',
          image: 'volcano1',
        },
        4944687: {
          y: '-1',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-3',
          image: 'spaceport9',
        },
        4976223: {
          y: '-2',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-4',
          image: 'spaceport9',
        },
        4944678: {
          y: '5',
          efficiency: '100',
          level: '30',
          name: 'Oversight Ministry',
          url: '/oversight',
          x: '3',
          image: 'oversight9',
        },
        4944681: {
          y: '5',
          efficiency: '100',
          level: '30',
          name: 'Kalavian Ruins',
          url: '/kalavianruins',
          x: '-1',
          image: 'kalavianruins1',
        },
        4942219: {
          y: '0',
          efficiency: '100',
          level: '30',
          name: 'Planetary Command Center',
          url: '/planetarycommand',
          x: '0',
          image: 'command9',
        },
        4976350: {
          y: '-2',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-5',
          image: 'spaceport9',
        },
        4970232: {
          efficiency: '100',
          name: 'Munitions Lab',
          x: '-4',
          image: 'munitionslab6',
          y: '2',
          level: '30',
          url: '/munitionslab',
        },
        4943631: {
          y: '5',
          efficiency: '100',
          level: '30',
          name: 'Malcud Field',
          url: '/malcudfield',
          x: '-5',
          image: 'malcudfield1',
        },
        4970063: {
          efficiency: '100',
          name: 'Espionage Ministry',
          x: '2',
          image: 'espionage9',
          y: '2',
          level: '30',
          url: '/espionage',
        },
        4968550: {
          efficiency: '100',
          name: 'Cloaking Lab',
          x: '-5',
          image: 'cloakinglab9',
          y: '2',
          level: '30',
          url: '/cloakinglab',
        },
        4944686: {
          y: '-1',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-2',
          image: 'spaceport9',
        },
        4976221: {
          y: '-2',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-2',
          image: 'spaceport9',
        },
        4975891: {
          y: '-2',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '0',
          image: 'spaceport9',
        },
        4979711: {
          y: '0',
          efficiency: '25',
          level: '30',
          name: 'Shield Against Weapons',
          url: '/saw',
          x: '1',
          image: 'saw9',
        },
        'saw-1': {
          y: '0',
          efficiency: '100',
          level: '30',
          name: 'Shield Against Weapons',
          url: '/saw',
          x: '-1',
          image: 'saw9',
        },
        'saw-2': {
          y: '0',
          efficiency: '100',
          level: '30',
          name: 'Shield Against Weapons',
          url: '/saw',
          x: '-2',
          image: 'saw9',
        },
        'saw-3': {
          y: '0',
          efficiency: '100',
          level: '30',
          name: 'Shield Against Weapons',
          url: '/saw',
          x: '-3',
          image: 'saw9',
        },
        'saw-4': {
          y: '0',
          efficiency: '100',
          level: '30',
          name: 'Shield Against Weapons',
          url: '/saw',
          x: '-4',
          image: 'saw9',
        },
        'saw-5': {
          y: '0',
          efficiency: '100',
          level: '30',
          name: 'Shield Against Weapons',
          url: '/saw',
          x: '-5',
          image: 'saw9',
        },
        4966153: {
          efficiency: '100',
          name: 'Security Ministry',
          x: '3',
          image: 'security9',
          y: '2',
          level: '30',
          url: '/security',
        },
        ship5: {
          efficiency: '100',
          name: 'Shipyard',
          x: '5',
          image: 'shipyard9',
          y: '1',
          level: '30',
          url: '/shipyard',
        },
        ship4: {
          efficiency: '100',
          name: 'Shipyard',
          x: '4',
          image: 'shipyard9',
          y: '1',
          level: '30',
          url: '/shipyard',
        },
        ship3: {
          efficiency: '100',
          name: 'Shipyard',
          x: '3',
          image: 'shipyard9',
          y: '1',
          level: '30',
          url: '/shipyard',
        },
        ship2: {
          efficiency: '100',
          name: 'Shipyard',
          x: '2',
          image: 'shipyard9',
          y: '1',
          level: '30',
          url: '/shipyard',
        },
        ship1: {
          efficiency: '100',
          name: 'Shipyard',
          x: '1',
          image: 'shipyard9',
          y: '1',
          level: '30',
          url: '/shipyard',
        },
        ship0: {
          efficiency: '100',
          name: 'Shipyard',
          x: '0',
          image: 'shipyard9',
          y: '1',
          level: '30',
          url: '/shipyard',
        },
        'ship-1': {
          efficiency: '100',
          name: 'Shipyard',
          x: '-1',
          image: 'shipyard9',
          y: '1',
          level: '30',
          url: '/shipyard',
          work: {
            seconds_remaining: 5 * 60 * 60,
            start: moment().subtract(1, 'hour').format(DATE_FORMAT),
            end: moment().add(5, 'hours').format(DATE_FORMAT),
          },
        },
        'ship-2': {
          efficiency: '100',
          name: 'Shipyard',
          x: '-2',
          image: 'shipyard9',
          y: '1',
          level: '30',
          url: '/shipyard',
          work: {
            seconds_remaining: 5 * 60 * 60,
            start: moment().subtract(1, 'hour').format(DATE_FORMAT),
            end: moment().add(5, 'hours').format(DATE_FORMAT),
          },
        },
        'ship-3': {
          efficiency: '100',
          name: 'Shipyard',
          x: '-3',
          image: 'shipyard9',
          y: '1',
          level: '30',
          url: '/shipyard',
          work: {
            seconds_remaining: 5 * 60 * 60,
            start: moment().subtract(1, 'hour').format(DATE_FORMAT),
            end: moment().add(5, 'hours').format(DATE_FORMAT),
          },
        },
        'ship1-4': {
          efficiency: '100',
          name: 'Shipyard',
          x: '-4',
          image: 'shipyard9',
          y: '1',
          level: '30',
          url: '/shipyard',
          work: {
            seconds_remaining: 5 * 60 * 60,
            start: moment().subtract(1, 'hour').format(DATE_FORMAT),
            end: moment().add(5, 'hours').format(DATE_FORMAT),
          },
        },
        'ship-5': {
          efficiency: '100',
          name: 'Shipyard',
          x: '-5',
          image: 'shipyard9',
          y: '1',
          level: '30',
          url: '/shipyard',
          work: {
            seconds_remaining: 5 * 60 * 60,
            start: moment().subtract(1, 'hour').format(DATE_FORMAT),
            end: moment().add(5, 'hours').format(DATE_FORMAT),
          },
        },
        4944688: {
          y: '-1',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-4',
          image: 'spaceport9',
        },
        4947856: {
          y: '4',
          efficiency: '100',
          level: '30',
          name: 'Oracle of Anid',
          url: '/oracleofanid',
          x: '2',
          image: 'oracleanid1',
        },
        4943604: {
          y: '2',
          efficiency: '100',
          level: '30',
          name: 'Subspace Transporter',
          url: '/transporter',
          x: '-1',
          image: 'transporter9',
        },
        'port5,-4': {
          y: '-4',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '5',
          image: 'spaceport9',
        },
        'port5,-5': {
          y: '-5',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '5',
          image: 'spaceport9',
        },
        'port4,-4': {
          y: '-4',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '4',
          image: 'spaceport9',
        },
        'port4,-5': {
          y: '-5',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '4',
          image: 'spaceport9',
        },
        'port3,-4': {
          y: '-4',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '3',
          image: 'spaceport9',
        },
        'port3,-5': {
          y: '-5',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '3',
          image: 'spaceport9',
        },
        'port2,-1': {
          y: '-1',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '2',
          image: 'spaceport9',
        },
        'port2,-2': {
          y: '-2',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '2',
          image: 'spaceport9',
        },
        'port2,-3': {
          y: '-3',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '2',
          image: 'spaceport9',
        },
        'port2,-4': {
          y: '-4',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '2',
          image: 'spaceport9',
        },
        'port2,-5': {
          y: '-5',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '2',
          image: 'spaceport9',
        },
        'port1,-1': {
          y: '-1',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '1',
          image: 'spaceport9',
        },
        'port1,-2': {
          y: '-2',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '1',
          image: 'spaceport9',
        },
        'port1,-3': {
          y: '-3',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '1',
          image: 'spaceport9',
        },
        'port1,-4': {
          y: '-4',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '1',
          image: 'spaceport9',
        },
        'port1,-5': {
          y: '-5',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '1',
          image: 'spaceport9',
        },
        'port-5,-3': {
          y: '-3',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-5',
          image: 'spaceport9',
        },
        'port-4,-3': {
          y: '-3',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-4',
          image: 'spaceport9',
        },
        'port-3,-3': {
          y: '-3',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-3',
          image: 'spaceport9',
        },
        'port-2,-3': {
          y: '-3',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-2',
          image: 'spaceport9',
        },
        'port-1,-3': {
          y: '-3',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-1',
          image: 'spaceport9',
        },
        'port0,-3': {
          y: '-3',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '0',
          image: 'spaceport9',
        },
        'port-5,-4': {
          y: '-4',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-5',
          image: 'spaceport9',
        },
        'port-4,-4': {
          y: '-4',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-4',
          image: 'spaceport9',
        },
        'port-3,-4': {
          y: '-4',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-3',
          image: 'spaceport9',
        },
        'port-2,-4': {
          y: '-4',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-2',
          image: 'spaceport9',
        },
        'port-1,-4': {
          y: '-4',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-1',
          image: 'spaceport9',
        },
        'port0,-4': {
          y: '-4',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '0',
          image: 'spaceport9',
        },
        'port-5,-5': {
          y: '-5',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-5',
          image: 'spaceport9',
        },
        'port-4,-5': {
          y: '-5',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-4',
          image: 'spaceport9',
        },
        'port-3,-5': {
          y: '-5',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-3',
          image: 'spaceport9',
        },
        'port-2,-5': {
          y: '-5',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-2',
          image: 'spaceport9',
        },
        'port-1,-5': {
          y: '-5',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '-1',
          image: 'spaceport9',
        },
        'port0,-5': {
          y: '-5',
          efficiency: '100',
          level: '30',
          name: 'Space Port',
          url: '/spaceport',
          x: '0',
          image: 'spaceport9',
        },
        ssla: {
          y: '5',
          efficiency: '100',
          level: '30',
          name: 'Space Station Lab',
          url: '/ssla',
          x: '4',
          image: 'ssla9',
        },
        sslb: {
          y: '5',
          efficiency: '100',
          level: '30',
          name: 'Space Station Lab',
          url: '/sslb',
          x: '5',
          image: 'sslb9',
        },
        sslc: {
          y: '4',
          efficiency: '100',
          level: '30',
          name: 'Space Station Lab',
          url: '/sslc',
          x: '5',
          image: 'sslc9',
        },
        ssld: {
          y: '4',
          efficiency: '100',
          level: '30',
          name: 'Space Station Lab',
          url: '/ssld',
          x: '4',
          image: 'ssld9',
        },
        intel: {
          y: '3',
          efficiency: '100',
          level: '30',
          name: 'Intel Training',
          url: '/inteltraining',
          x: '4',
          image: 'inteltraining9',
        },
        mayhem: {
          y: '3',
          efficiency: '100',
          level: '30',
          name: 'Mayhem Training',
          url: '/mayhemtraining',
          x: '5',
          image: 'mayhemtraining9',
        },
        politics: {
          y: '2',
          efficiency: '100',
          level: '30',
          name: 'Politics Training',
          url: '/politicstraining',
          x: '4',
          image: 'politicstraining9',
        },
        theft: {
          y: '2',
          efficiency: '100',
          level: '30',
          name: 'Theft Training',
          url: '/thefttraining',
          x: '5',
          image: 'thefttraining9',
        },
        lcota: {
          x: 4,
          y: -2,
          efficiency: 100,
          level: 30,
          name: 'Lost City of Tyleon',
          url: '/lcota',
          image: 'lcota',
        },
        lcotb: {
          x: 3,
          y: -2,
          efficiency: 100,
          level: 30,
          name: 'Lost City of Tyleon',
          url: '/lcotb',
          image: 'lcotb',
        },
        lcotc: {
          x: 5,
          y: -3,
          efficiency: 100,
          level: 30,
          name: 'Lost City of Tyleon',
          url: '/lcotc',
          image: 'lcotc',
        },
        lcotd: {
          x: 4,
          y: -3,
          efficiency: 100,
          level: 30,
          name: 'Lost City of Tyleon',
          url: '/lcotd',
          image: 'lcotd',
        },
        lcote: {
          x: 3,
          y: -3,
          efficiency: 100,
          level: 30,
          name: 'Lost City of Tyleon',
          url: '/lcote',
          image: 'lcote',
        },
        lcotf: {
          x: 5,
          y: -2,
          efficiency: 100,
          level: 30,
          name: 'Lost City of Tyleon',
          url: '/lcotf',
          image: 'lcotf',
        },
        lcotg: {
          x: 5,
          y: -1,
          efficiency: 100,
          level: 30,
          name: 'Lost City of Tyleon',
          url: '/lcotg',
          image: 'lcotg',
        },
        lcoth: {
          x: 4,
          y: -1,
          efficiency: 100,
          level: 30,
          name: 'Lost City of Tyleon',
          url: '/lcoth',
          image: 'lcoth',
        },
        lcoti: {
          x: 3,
          y: -1,
          efficiency: 100,
          level: 30,
          name: 'Lost City of Tyleon',
          url: '/lcoti',
          image: 'lcoti',
        },
      },
    };
  },

  get_status() {
    return {
      server: Server.status_block(),
      empire: Empire.status_block(),
      body: Body.status_block(),
    };
  },

  status_block() {
    return {
      id: 'id-goes-here',
      x: -40,
      y: 29,
      zone: '0|0',
      star_id: 'id-goes-here',
      star_name: 'Sol',
      orbit: 1,
      type: 'habitable planet',
      name: 'Earth',
      image: 'p35',
      size: 67,
      water: 900,
      ore: {
        anthracite: 0,
        bauxite: 4000,
        beryl: 0,
        chalcopyrite: 0,
        chromite: 0,
        fluorite: 0,
        galena: 0,
        goethite: 0,
        gold: 3399,
        gypsum: 0,
        halite: 0,
        kerogen: 0,
        magnetite: 0,
        methane: 0,
        monazite: 0,
        rutile: 0,
        sulfur: 0,
        trona: 0,
        uraninite: 0,
        zircon: 0,
      },
      empire: {
        id: 'id-goes-here',
        name: 'Earthlings',
        alignment: 'ally',
        is_isolationist: 1,
      },
      station: {
        id: 'id-goes-here',
        x: 143,
        y: -27,
        name: 'The Death Star',
      },
      needs_surface_refresh: 0,
      building_count: 7,
      build_queue_size: 15,
      build_queue_len: 10,
      plots_available: 60,
      happiness: 3939,
      happiness_hour: 25,
      unhappy_date: '01 13 2014 16:11:21 +0600',
      neutral_entry: '01 13 2014 16:11:21 +0600',
      propaganda_boost: 20,
      food_stored: 33329,
      food_capacity: 40000,
      food_hour: 229,
      energy_stored: 39931,
      energy_capacity: 43000,
      energy_hour: 391,
      ore_hour: 284,
      ore_capacity: 35000,
      ore_stored: 1901,
      waste_hour: 933,
      waste_stored: 9933,
      waste_capacity: 13000,
      water_stored: 9929,
      water_hour: 295,
      water_capacity: 51050,
      skip_incoming_ships: 1,
      num_incoming_enemy: 0,
      num_incoming_ally: 0,
      num_incoming_own: 0,
      incoming_enemy_ships: {},
      incoming_ally_ships: {},
      incoming_own_ships: {},
    };
  },
};

export default Body;
