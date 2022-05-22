import { makeAutoObservable } from 'mobx';
import _ from 'lodash';
import moment from 'moment';
import { serverDateToMoment, formatMomentLong, serverDateToDateObj } from 'app/util';
import constants from 'app/constants';

class ServerRPCStore {
  time = '01 31 2010 13:09:05 +0600';

  version = '1.0';

  announcement = 0;

  promotions: any[] = [];

  rpc_limit = 10000;

  star_map_size = {
    x: [-15, 15],
    y: [-15, 15],
    z: [-15, 15],
  };

  constructor() {
    makeAutoObservable(this);
  }

  update(server: any) {
    // TODO: show announcement window if needed.

    this.time = server.time;
    this.rpc_limit = server.rpc_limit;
    this.star_map_size = server.star_map_size;
    this.version = server.version;

    // The server won't return the promotions block if there aren't any but components
    // will expect it to exist.
    this.promotions = server.promotions || [];
  }

  tick() {
    const now = Date.now();

    this.time = this.serverTimeMoment.add(1, 'second').format(constants.NEW_SERVER_DATE_FORMAT);

    this.promotions = _.chain(this.promotions)
      .filter((promotion: any) => now < serverDateToDateObj(promotion.end_date).valueOf())
      .map((promotion: any) => {
        promotion.header = promotion.title;
        promotion.ends = moment().to(serverDateToMoment(promotion.end_date));

        return promotion;
      })
      .value();
  }

  get serverTimeMoment() {
    return serverDateToMoment(this.time).utcOffset(0);
  }

  get clientTimeMoment() {
    return serverDateToMoment(this.time);
  }

  get serverTimeFormatted() {
    return formatMomentLong(this.serverTimeMoment);
  }

  get clientTimeFormatted() {
    return formatMomentLong(this.clientTimeMoment);
  }

  get serverTimeMs() {
    return this.serverTimeMoment.valueOf();
  }

  get clientTimeMs() {
    return this.clientTimeMoment.valueOf();
  }
}

export default new ServerRPCStore();
