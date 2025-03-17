import { drawGrid } from "./utils";
import { Tile, TileType } from "./Tile";

(function () {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const canvas: HTMLCanvasElement = document.querySelector("#maze");
    const PLANE_SIZE = 7;
    const CELL_SIZE = canvas.width / PLANE_SIZE;
    const context: CanvasRenderingContext2D = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    const tileTypes: string[] = Object.keys(TileType).filter((type) =>
      isNaN(Number(type)),
    );

    const Plane = new Array(PLANE_SIZE * PLANE_SIZE).fill(tileTypes.length);

    const tiles: Tile[] = tileTypes.map(
      (type: string) =>
        new Tile(TileType[type], `./assets/tiles_colored/Tile${type}.png`),
    );

    drawGrid(context, tiles, Plane, PLANE_SIZE, CELL_SIZE);
  });
})();
