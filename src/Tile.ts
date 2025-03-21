export enum Direction {
  top = "top",
  right = "right",
  bottom = "bottom",
  left = "left",
}

export type Directions = keyof typeof Direction;

type TileNeighbours = {
  top: TileType[];
  right: TileType[];
  bottom: TileType[];
  left: TileType[];
};

export enum TileType {
  Cross,
  Empty,
  TUp,
  TDown,
  TLeft,
  TRight,
  LineHorizontal,
  LineVertical,
  LUpRight,
  LUpLeft,
  LDownRight,
  LDownLeft,
}

export class Tile {
  private TILE_CONNECTIONS: Record<
    TileType,
    { top: boolean; right: boolean; bottom: boolean; left: boolean }
  > = {
    [TileType.Cross]: { top: true, right: true, bottom: true, left: true },
    [TileType.Empty]: { top: false, right: false, bottom: false, left: false },
    [TileType.TUp]: { top: true, right: true, bottom: false, left: true },
    [TileType.TDown]: { top: false, right: true, bottom: true, left: true },
    [TileType.TLeft]: { top: true, right: false, bottom: true, left: true },
    [TileType.TRight]: { top: true, right: true, bottom: true, left: false },
    [TileType.LineHorizontal]: {
      top: false,
      right: true,
      bottom: false,
      left: true,
    },
    [TileType.LineVertical]: {
      top: true,
      right: false,
      bottom: true,
      left: false,
    },
    [TileType.LUpRight]: { top: true, right: true, bottom: false, left: false },
    [TileType.LUpLeft]: { top: true, right: false, bottom: false, left: true },
    [TileType.LDownRight]: {
      top: false,
      right: true,
      bottom: true,
      left: false,
    },
    [TileType.LDownLeft]: {
      top: false,
      right: false,
      bottom: true,
      left: true,
    },
  };
  public type: TileType;
  public image: HTMLImageElement;
  public canTouch: TileNeighbours;

  constructor(type: TileType, image: string) {
    this.type = type;
    this.image = this.setImage(image);
    this.canTouch = this.calculateNeighbours(type);
  }

  protected setImage(source: string): HTMLImageElement {
    const image = new Image();
    image.src = source;

    return image;
  }

  public getAllowedDirections() {
    return Object.keys(this.TILE_CONNECTIONS[this.type]).filter(
      (direction) => this.TILE_CONNECTIONS[this.type][direction as Directions],
    );
  }

  protected calculateNeighbours(type: TileType): TileNeighbours {
    return {
      top: this.getMatchingTypes(type, Direction.top),
      right: this.getMatchingTypes(type, Direction.right),
      bottom: this.getMatchingTypes(type, Direction.bottom),
      left: this.getMatchingTypes(type, Direction.left),
    };
  }

  // Returns all tile types that can be connected by matching opposite directions states.
  private getMatchingTypes(type: TileType, direction: Directions): TileType[] {
    return Object.keys(this.TILE_CONNECTIONS)
      .map(Number)
      .filter((otherType: TileType) => {
        return (
          (this.TILE_CONNECTIONS[type][direction] &&
            this.TILE_CONNECTIONS[otherType][
              this.oppositeDirection(direction)
            ]) ||
          (!this.TILE_CONNECTIONS[type][direction] &&
            !this.TILE_CONNECTIONS[otherType][
              this.oppositeDirection(direction)
            ])
        );
      }) as TileType[];
  }

  private oppositeDirection(direction: Directions): Directions {
    const oppositeMap: Record<Directions, Directions> = {
      top: "bottom",
      right: "left",
      bottom: "top",
      left: "right",
    };
    return oppositeMap[direction];
  }
}
