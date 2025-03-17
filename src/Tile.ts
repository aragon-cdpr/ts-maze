export type Direction = "top" | "right" | "bottom" | "left";

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

  protected calculateNeighbours(type: TileType): TileNeighbours {
    return {
      top: this.getMatchingTypes(type, "top"),
      right: this.getMatchingTypes(type, "right"),
      bottom: this.getMatchingTypes(type, "bottom"),
      left: this.getMatchingTypes(type, "left"),
    };
  }

  private getMatchingTypes(type: TileType, direction: Direction): TileType[] {
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

  private oppositeDirection(direction: Direction): Direction {
    const oppositeMap: Record<Direction, Direction> = {
      top: "bottom",
      right: "left",
      bottom: "top",
      left: "right",
    };
    return oppositeMap[direction];
  }
}
