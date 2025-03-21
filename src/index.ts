import { drawGrid, type Plane } from "./utils";
import { Tile, TileType, Direction, type Directions } from "./Tile";

(function () {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const canvas: HTMLCanvasElement = document.querySelector("#maze");
    const PLAYER_SIZE_FACTOR = 0.15;
    const PLANE_SIZE = 10;
    const CELL_SIZE: number = canvas.width / PLANE_SIZE;
    const PLAYER_SIZE: number = CELL_SIZE * PLAYER_SIZE_FACTOR;
    const context: CanvasRenderingContext2D = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    const tileTypes: string[] = Object.keys(TileType).filter((type) =>
      isNaN(Number(type)),
    );

    const renderPlane = (plane: Plane) => {
      plane.forEach((tile: Tile, cell) => {
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
        CELL_SIZE * (Player.x + 0.5) - PLAYER_SIZE / 2,
        CELL_SIZE * (Player.y + 0.5) - PLAYER_SIZE / 2,
        PLAYER_SIZE,
        PLAYER_SIZE,
      );
    };

    const Plane: Plane = new Array(PLANE_SIZE * PLANE_SIZE).fill(undefined);
    const Player = {
      x: Math.floor(PLANE_SIZE / 2),
      y: Math.floor(PLANE_SIZE / 2),
    };

    const updatePlayer = (direction: Directions) => {
      let currx = Player.x;
      let curry = Player.y;
      const currentPlayerTile: Tile = Plane[curry * PLANE_SIZE + currx] as Tile;
      const allowedDriections = currentPlayerTile.getAllowedDirections();
      switch (direction) {
        case Direction.top:
          if (allowedDriections.indexOf(direction) != -1 && curry > 0) {
            curry--;
          }
          break;
        case Direction.right:
          if (
            allowedDriections.indexOf(direction) != -1 &&
            currx < PLANE_SIZE - 1
          ) {
            currx++;
          }
          break;
        case Direction.bottom:
          if (
            allowedDriections.indexOf(direction) != -1 &&
            curry < PLANE_SIZE - 1
          ) {
            curry++;
          }
          break;
        case Direction.left:
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
          updatePlayer(Direction.top);
          break;
        case "a":
          updatePlayer(Direction.left);
          break;
        case "s":
          updatePlayer(Direction.bottom);
          break;
        case "d":
          updatePlayer(Direction.right);
          break;
        default:
          break;
      }

      renderPlane(Plane);
      renderPlayer(Player);
    };
  });
})();
