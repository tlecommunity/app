declare const YAHOO: any;

//
// Instead of blindly calling methods in the YUI code, use these hooks instead.
//
class LegacyHooks {
  static refreshPlanet(): void {
    YAHOO.lacuna.MapPlanet.Refresh();
  }

  static resetGame(): void {
    YAHOO.lacuna.Game.Reset();
    YAHOO.lacuna.MapPlanet.Reset();
    YAHOO.lacuna.Game.DoLogin();
  }

  static tick(): void {
    YAHOO.lacuna.Game.onTick.fire();
  }

  static loadPlanet(planetId: number, silent: boolean) {
    console.log(`Legacy hook loading planet ID ${planetId}`);
    YAHOO.lacuna.MapStar.MapVisible(false);
    YAHOO.lacuna.MapPlanet.MapVisible(true);
    YAHOO.lacuna.MapPlanet.Load(planetId, true, silent);
  }

  static loadStarmap(x: number, y: number) {
    console.log(`Legacy hook loading starmap at coordinates X: ${x}, Y: ${y}`);
    YAHOO.lacuna.MapPlanet.MapVisible(false);
    YAHOO.lacuna.MapStar.MapVisible(true);
    YAHOO.lacuna.MapStar.Load();
    YAHOO.lacuna.MapStar.Jump(x, y);
  }
}

export default LegacyHooks;
