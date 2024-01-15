import ClientBase from 'app/services/base';
import { BodyRearrangeBuildingsParams } from 'app/interfaces/body';

class BodyService extends ClientBase {
  getBuildings(id: number) {
    return this.call('body', 'get_buildings', [id]);
  }

  getStatus(id: number) {
    return this.call('body', 'get_status', [id]);
  }

  rearrangeBuildings(params: BodyRearrangeBuildingsParams) {
    return this.call('body', 'rearrange_buildings', params);
  }
}

export default new BodyService();
