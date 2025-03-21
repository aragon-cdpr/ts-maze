import { type Directions, Tile, TileType } from "./Tile";

type PossibleNeighbours = number[];
export type Plane = (Tile | PossibleNeighbours | undefined)[];

export const drawGrid = async (
  tiles: Tile[],
  plane: Plane,
  TilesCount: number,
) => {
  const loadImagePromises = tiles.map((tile) => {
    return new Promise<HTMLImageElement>((resolve) => {
      tile.image.onload = () => {
        resolve(tile.image); // Resolving when image is loaded
      };
    });
  });
  // Helper array to store amount of possible neighbours for each cell.
  const helper: PossibleNeighbours = new Array(plane.length).fill(tiles.length);

  const upgradeNeighbours = (index: number, tile: Tile, dir: Directions) => {
    if (plane[index] !== undefined && Array.isArray(plane[index])) {
      // If cell is an array of possible neighbours, get unique matching neighbours.
      const possibleNeighbours: PossibleNeighbours = plane[index];
      plane[index] = tile.canTouch[dir].filter((item) =>
        possibleNeighbours.includes(item),
      );
      helper[index] = plane[index].length;
    } else if (plane[index] === undefined) {
      // If cell is undefined, assign possible neighbours from tile type.
      helper[index] = tile.canTouch[dir].length;
      plane[index] = tile.canTouch[dir];
    }
  };

  // Wait for all images to be loaded
  await Promise.all(loadImagePromises);

  for (let i = 0; i < plane.length; i++) {
    let cell: number = -1;
    // First iteration, pick random cell and define all possible neighbours.
    if (i == 0) {
      cell = (Math.random() * plane.length) | 0;
      if (plane[cell] === undefined) {
        plane[cell] = Object.keys(TileType).filter(
          (type) => !isNaN(Number(type)),
        ) as unknown as PossibleNeighbours;
      }
    } else {
      // Next iterations, pick cell with the smallest amount of possible neighbours.
      cell = helper.indexOf(Math.min(...helper));
    }
    let randomindex: number = -1;

    if (Array.isArray(plane[cell])) {
      // If cell is an array of possible neighbours, pick random tile from it.
      const planeCell = plane[cell] as number[];
      randomindex = (Math.random() * planeCell.length) | 0;
    }
    // Assign random tile to the cell. Disqualify index from further iterations.
    const tile: Tile = tiles[plane[cell][randomindex]];
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
