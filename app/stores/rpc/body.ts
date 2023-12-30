import { makeAutoObservable } from 'mobx';
import ServerRPCStore from 'app/stores/rpc/server';
import _ from 'lodash';
import * as util from 'app/util';
import { types } from '@tlecommunity/client';
import YAHOO from 'app/shims/yahoo';
import LegacyHooks from 'app/legacyHooks';

const { int } = util;

class BodyRPCStore {
  id = 0;

  x = 0;

  y = 0;

  star_id = 0;

  star_name = '';

  orbit = 0;

  type = '';

  name = '';

  image = '';

  surfaceImage = '';

  size = 0;

  water = 0;

  ore = {
    anthracite: 0,
    bauxite: 0,
    beryl: 0,
    chromite: 0,
    chalcopyrite: 0,
    fluorite: 0,
    galena: 0,
    goethite: 0,
    gold: 0,
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
  };

  empire = {
    id: 0,
    name: '',
    alignment: '',
    is_isolationist: 0,
  };

  station = {
    id: 0,
    x: 0,
    y: 0,
    name: '',
  };

  needs_surface_refresh = 0;

  building_count = 0;

  build_queue_size = 0;

  build_queue_len = 0;

  plots_available = 0;

  happiness = 0;

  happiness_hour = 0;

  unhappy_date = '01 13 2014 16:11:21 +0600';

  neutral_entry = '01 13 2014 16:11:21 +0600';

  propaganda_boost = 0;

  food_stored = 0;

  food_capacity = 0;

  food_hour = 0;

  energy_stored = 0;

  energy_capacity = 0;

  energy_hour = 0;

  ore_hour = 0;

  ore_capacity = 0;

  ore_stored = 0;

  population = 0;

  waste_hour = 0;

  waste_stored = 0;

  waste_capacity = 0;

  water_stored = 0;

  water_hour = 0;

  water_capacity = 0;

  skip_incoming_ships = 0;

  num_incoming_enemy = 0;

  num_incoming_ally = 0;

  num_incoming_own = 0;

  incoming_enemy_ships: any[] = [];

  incoming_ally_ships: any[] = [];

  incoming_own_ships: any[] = [];

  alliance = {
    id: 0,
    name: '',
  };

  influence = {
    total: 0,
    spent: 0,
  };

  constructor() {
    makeAutoObservable(this);
  }

  clear() {}

  update(body: types.Status.BodyBlock['body']) {
    this.id = body.id;
    this.x = int(body.x);
    this.y = int(body.y);
    this.star_id = int(body.star_id);
    this.star_name = body.star_name;
    this.orbit = int(body.orbit);
    this.type = body.type;
    this.name = body.name;
    this.image = body.image;
    this.surfaceImage = body.image.replace(/-\d+$/, '');
    this.size = int(body.size);
    this.water = body.water;

    this.ore.anthracite = body.ore.anthracite;
    this.ore.bauxite = body.ore.bauxite;
    this.ore.beryl = body.ore.beryl;
    this.ore.chromite = body.ore.chromite;
    this.ore.chalcopyrite = body.ore.chalcopyrite;
    this.ore.fluorite = body.ore.fluorite;
    this.ore.galena = body.ore.galena;
    this.ore.goethite = body.ore.goethite;
    this.ore.gold = body.ore.gold;
    this.ore.gypsum = body.ore.gypsum;
    this.ore.halite = body.ore.halite;
    this.ore.kerogen = body.ore.kerogen;
    this.ore.magnetite = body.ore.magnetite;
    this.ore.methane = body.ore.methane;
    this.ore.monazite = body.ore.monazite;
    this.ore.rutile = body.ore.rutile;
    this.ore.sulfur = body.ore.sulfur;
    this.ore.trona = body.ore.trona;
    this.ore.uraninite = body.ore.uraninite;
    this.ore.zircon = body.ore.zircon;

    if (body.empire) {
      this.empire.id = body.empire.id;
      this.empire.name = body.empire.name;
      this.empire.alignment = body.empire.alignment;
      this.empire.is_isolationist = body.empire.is_isolationist;
    }

    if (body.station) {
      this.station.id = body.station.id;
      this.station.x = body.station.x;
      this.station.y = body.station.y;
      this.station.name = body.station.name;
    }

    //
    // TODO: the following if conditions are a mess.
    // They're here because we are using the same interface to define all body status responses.
    // We should probably have separate interfaces for "our bodies" and all others.
    // This method only handles bodies that belong to us.. however I can't find a clean way to
    // represent this yet in TypeScript without duplicating info.. still too new to TS to know!
    //

    if (typeof body.needs_surface_refresh !== 'undefined')
      this.needs_surface_refresh = body.needs_surface_refresh;
    if (typeof body.building_count !== 'undefined') this.building_count = int(body.building_count);
    if (typeof body.build_queue_size !== 'undefined') this.build_queue_size = body.build_queue_size;
    if (typeof body.build_queue_len !== 'undefined') this.build_queue_len = body.build_queue_len;
    if (typeof body.plots_available !== 'undefined')
      this.plots_available = int(body.plots_available);
    if (typeof body.happiness !== 'undefined') this.happiness = body.happiness;
    if (typeof body.happiness_hour !== 'undefined') this.happiness_hour = body.happiness_hour;
    if (typeof body.unhappy_date !== 'undefined') this.unhappy_date = body.unhappy_date;
    if (typeof body.neutral_entry !== 'undefined') this.neutral_entry = body.neutral_entry;
    if (typeof body.propaganda_boost !== 'undefined') this.propaganda_boost = body.propaganda_boost;
    if (typeof body.food_stored !== 'undefined') this.food_stored = body.food_stored;
    if (typeof body.food_capacity !== 'undefined') this.food_capacity = body.food_capacity;
    if (typeof body.food_hour !== 'undefined') this.food_hour = body.food_hour;
    if (typeof body.energy_stored !== 'undefined') this.energy_stored = body.energy_stored;
    if (typeof body.energy_capacity !== 'undefined') this.energy_capacity = body.energy_capacity;
    if (typeof body.energy_hour !== 'undefined') this.energy_hour = body.energy_hour;
    if (typeof body.ore_hour !== 'undefined') this.ore_hour = body.ore_hour;
    if (typeof body.ore_capacity !== 'undefined') this.ore_capacity = body.ore_capacity;
    if (typeof body.ore_stored !== 'undefined') this.ore_stored = body.ore_stored;
    if (typeof body.population !== 'undefined') this.population = body.population;
    if (typeof body.waste_hour !== 'undefined') this.waste_hour = body.waste_hour;
    if (typeof body.waste_stored !== 'undefined') this.waste_stored = body.waste_stored;
    if (typeof body.waste_capacity !== 'undefined') this.waste_capacity = body.waste_capacity;
    if (typeof body.water_stored !== 'undefined') this.water_stored = body.water_stored;
    if (typeof body.water_hour !== 'undefined') this.water_hour = body.water_hour;
    if (typeof body.water_capacity !== 'undefined') this.water_capacity = body.water_capacity;
    if (typeof body.skip_incoming_ships !== 'undefined')
      this.skip_incoming_ships = body.skip_incoming_ships;
    if (typeof body.num_incoming_own !== 'undefined')
      this.num_incoming_own = int(body.num_incoming_own);
    if (typeof body.num_incoming_ally !== 'undefined')
      this.num_incoming_ally = int(body.num_incoming_ally);
    if (typeof body.num_incoming_enemy !== 'undefined')
      this.num_incoming_enemy = int(body.num_incoming_enemy);
    if (typeof body.incoming_enemy_ships !== 'undefined')
      this.incoming_enemy_ships = body.incoming_enemy_ships;
    if (typeof body.incoming_ally_ships !== 'undefined')
      this.incoming_ally_ships = body.incoming_ally_ships;
    if (typeof body.incoming_own_ships !== 'undefined')
      this.incoming_own_ships = body.incoming_own_ships;

    if (body.alliance) {
      this.alliance = body.alliance;
    }

    if (body.influence) {
      this.influence = body.influence;
    }

    const updateShip = function (ship: any) {
      ship.arrival_ms = util.serverDateToMs(ship.date_arrives) - ServerRPCStore.serverTimeMs;
      return ship;
    };

    _.map(this.incoming_own_ships, updateShip);
    _.map(this.incoming_ally_ships, updateShip);
    _.map(this.incoming_enemy_ships, updateShip);

    if (body.needs_surface_refresh) {
      LegacyHooks.refreshPlanet();
    }
  }

  tick() {
    const tickIncoming = function (ship: any) {
      ship.arrival_ms -= 1000;
      return ship;
    };

    _.map(this.incoming_own_ships, tickIncoming);
    _.map(this.incoming_ally_ships, tickIncoming);
    _.map(this.incoming_enemy_ships, tickIncoming);

    const tickResource = function (
      production: number,
      capacity: number | undefined,
      stored: number,
      stopAtZero: boolean
    ) {
      const amount = production / 60 / 60;
      const rv = stored + amount;

      if (typeof capacity !== 'undefined' && rv > capacity) {
        return Math.floor(capacity);
      }
      if (rv < 0 && stopAtZero) {
        return 0;
      }
      return Math.floor(rv);
    };

    this.food_stored = tickResource(this.food_hour, this.food_capacity, this.food_stored, true);
    this.ore_stored = tickResource(this.ore_hour, this.ore_capacity, this.ore_stored, true);
    this.water_stored = tickResource(this.water_hour, this.water_capacity, this.water_stored, true);
    this.energy_stored = tickResource(
      this.energy_hour,
      this.energy_capacity,
      this.energy_stored,
      true
    );
    this.waste_stored = tickResource(this.waste_hour, this.waste_capacity, this.waste_stored, true);
    this.happiness = tickResource(this.happiness_hour, undefined, this.happiness, false);
  }

  get food_percent_full() {
    return Math.floor((this.food_stored / this.food_capacity) * 100);
  }

  get ore_percent_full() {
    return Math.floor((this.ore_stored / this.ore_capacity) * 100);
  }

  get water_percent_full() {
    return Math.floor((this.water_stored / this.water_capacity) * 100);
  }

  get energy_percent_full() {
    return Math.floor((this.energy_stored / this.energy_capacity) * 100);
  }

  get waste_percent_full() {
    return Math.floor((this.waste_stored / this.waste_capacity) * 100);
  }
}

export default new BodyRPCStore();
