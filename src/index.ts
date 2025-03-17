import { drawGrid } from "./utils";
import { Tile, TileType } from "./Tile";

(function () {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const canvas: HTMLCanvasElement = document.querySelector("#maze");
    const PLANE_SIZE = 7;
    const CELL_SIZE = canvas.width / PLANE_SIZE;
    const context: CanvasRenderingContext2D = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    const tileTypes: string[] = Object.keys(TileType).filter((type) =>
      isNaN(Number(type)),
    );

    const renderPlane = (Plane: Tile[] | undefined[] | number[]) => {
      Plane.forEach((tile: Tile, cell) => {
        context.drawImage(
          tile.image,
          (cell % PLANE_SIZE) * CELL_SIZE,
          Math.floor(cell / PLANE_SIZE) * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE,
        );
      });
    };

    const renderPlayer = (Player: { x: number; y: number }) => {
      context.fillStyle = "red";
      context.fillRect(
        CELL_SIZE * Player.x + CELL_SIZE / 2 - 8,
        CELL_SIZE * Player.y + CELL_SIZE / 2 - 8,
        16,
        16,
      );
    };

    const Plane: Tile[] | undefined[] | number[] = new Array(
      PLANE_SIZE * PLANE_SIZE,
    ).fill(undefined);
    const Player = {
      x: 3,
      y: 3,
    };

    const updatePlayer = (direction: string) => {
      let currx = Player.x;
      let curry = Player.y;
      const currentPlayerTile: Tile = Plane[curry * PLANE_SIZE + currx] as Tile;
      const allowedDriections = currentPlayerTile.getAllowedDirections();
      switch (direction) {
        case "up":
          if (allowedDriections.indexOf("top") != -1 && curry > 0) {
            curry--;
          }
          break;
        case "right":
          if (
            allowedDriections.indexOf(direction) != -1 &&
            currx < PLANE_SIZE - 1
          ) {
            currx++;
          }
          break;
        case "down":
          if (
            allowedDriections.indexOf("bottom") != -1 &&
            curry < PLANE_SIZE - 1
          ) {
            curry++;
          }
          break;
        case "left":
          if (allowedDriections.indexOf(direction) != -1 && currx > 0) {
            currx--;
          }
          break;
      }

      Player.x = currx;
      Player.y = curry;
    };

    const tiles: Tile[] = tileTypes.map(
      (type: string) =>
        new Tile(TileType[type], `./assets/tiles_colored/Tile${type}.png`),
    );

    await drawGrid(tiles, Plane, PLANE_SIZE);

    renderPlane(Plane);
    renderPlayer(Player);

    window.onkeypress = (event: KeyboardEvent) => {
      switch (event.key) {
        case "w":
          updatePlayer("up");
          break;
        case "a":
          updatePlayer("left");
          break;
        case "s":
          updatePlayer("down");
          break;
        case "d":
          updatePlayer("right");
          break;
        default:
          break;
      }

      renderPlane(Plane);
      renderPlayer(Player);
    };
  });
})();
