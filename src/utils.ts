import { Tile, TileType, type Direction } from "./Tile";

export const drawGrid = async (
  tiles: Tile[],
  plane: any[],
  TilesCount: number,
) => {
  const loadImagePromises = tiles.map((tile) => {
    return new Promise<HTMLImageElement>((resolve) => {
      tile.image.onload = () => {
        resolve(tile.image); // Resolving when image is loaded
      };
    });
  });
  const helper: number[] = new Array(plane.length).fill(tiles.length);

  const upgradeNeighbours = (index: number, tile: Tile, dir: Direction) => {
    if (plane[index] !== undefined && Array.isArray(plane[index])) {
      plane[index] = tile.canTouch[dir].filter((item) =>
        plane[index].includes(item),
      );
      helper[index] = plane[index].length;
    } else if (plane[index] === undefined) {
      helper[index] = tile.canTouch[dir].length;
      plane[index] = tile.canTouch[dir];
    }
  };

  // Wait for all images to be loaded
  await Promise.all(loadImagePromises);

  for (let i = 0; i < plane.length; i++) {
    let cell = -1;
    if (i == 0) {
      cell = (Math.random() * plane.length) | 0;
      if (plane[cell] === undefined) {
        plane[cell] = Object.keys(TileType).filter(
          (type) => !isNaN(Number(type)),
        );
      }
    } else {
      cell = helper.indexOf(Math.min(...helper));
    }
    const randomindex = (Math.random() * plane[cell].length) | 0;
    const tile = tiles[plane[cell][randomindex]];
    plane[cell] = tile;
    helper[cell] = 1000;

    if (cell + TilesCount <= plane.length - 1) {
      const index = cell + TilesCount;
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
    if (cell - TilesCount >= 0) {
      const index = cell - TilesCount;
      upgradeNeighbours(index, tile, "top");
    }
  }
};
