import { Tile, TileType, type Direction } from "./Tile";

export const drawGrid = async (
  context: CanvasRenderingContext2D,
  tiles: Tile[],
  plane: number[],
  TilesCount: number,
  CellSize: number,
) => {
  const loadImagePromises = tiles.map((tile) => {
    return new Promise<HTMLImageElement>((resolve) => {
      tile.image.onload = () => {
        resolve(tile.image); // Resolving when image is loaded
      };
    });
  });
  const helper: any[] = new Array(plane.length).fill(undefined);

  const upgradeNeighbours = (index: number, tile: Tile, dir: Direction) => {
    if (helper[index] !== undefined && Array.isArray(helper[index])) {
      helper[index] = tile.canTouch[dir].filter((item) =>
        helper[index].includes(item),
      );

      plane[index] = helper[index].length;
    } else if (helper[index] === undefined) {
      plane[index] = tile.canTouch[dir].length;
      helper[index] = tile.canTouch[dir];
    }
  };

  // Wait for all images to be loaded
  await Promise.all(loadImagePromises);

  for (let i = 0; i < plane.length; i++) {
    let cell = -1;
    if (i == 0) {
      cell = (Math.random() * plane.length) | 0;
      if (helper[cell] === undefined) {
        helper[cell] = Object.keys(TileType).filter(
          (type) => !isNaN(Number(type)),
        );
      }
    } else {
      cell = plane.indexOf(Math.min(...plane));
    }
    const randomindex = (Math.random() * helper[cell].length) | 0;
    const tile = tiles[helper[cell][randomindex]];
    helper[cell] = tile;
    plane[cell] = 1000;
    context.drawImage(
      tile.image,
      (cell % TilesCount) * CellSize,
      Math.floor(cell / TilesCount) * CellSize,
      CellSize,
      CellSize,
    );

    if (cell + 7 <= plane.length - 1) {
      const index = cell + 7;
      upgradeNeighbours(index, tile, "bottom");
    }
    if (cell - 1 >= 0 && cell % TilesCount !== 0) {
      const index = cell - 1;
      upgradeNeighbours(index, tile, "left");
    }
    if (cell + 1 <= plane.length - 1 && (cell + 1) % TilesCount !== 0) {
      const index = cell + 1;
      upgradeNeighbours(index, tile, "right");
    }
    if (cell - 7 >= 0) {
      const index = cell - 7;
      upgradeNeighbours(index, tile, "top");
    }
  }
};
