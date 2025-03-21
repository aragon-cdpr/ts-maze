(function () {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    var Direction;
    (function (Direction) {
        Direction["top"] = "top";
        Direction["right"] = "right";
        Direction["bottom"] = "bottom";
        Direction["left"] = "left";
    })(Direction || (Direction = {}));
    var TileType;
    (function (TileType) {
        TileType[TileType["Cross"] = 0] = "Cross";
        TileType[TileType["Empty"] = 1] = "Empty";
        TileType[TileType["TUp"] = 2] = "TUp";
        TileType[TileType["TDown"] = 3] = "TDown";
        TileType[TileType["TLeft"] = 4] = "TLeft";
        TileType[TileType["TRight"] = 5] = "TRight";
        TileType[TileType["LineHorizontal"] = 6] = "LineHorizontal";
        TileType[TileType["LineVertical"] = 7] = "LineVertical";
        TileType[TileType["LUpRight"] = 8] = "LUpRight";
        TileType[TileType["LUpLeft"] = 9] = "LUpLeft";
        TileType[TileType["LDownRight"] = 10] = "LDownRight";
        TileType[TileType["LDownLeft"] = 11] = "LDownLeft";
    })(TileType || (TileType = {}));
    class Tile {
        constructor(type, image) {
            this.TILE_CONNECTIONS = {
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
            this.type = type;
            this.image = this.setImage(image);
            this.canTouch = this.calculateNeighbours(type);
        }
        setImage(source) {
            const image = new Image();
            image.src = source;
            return image;
        }
        getAllowedDirections() {
            return Object.keys(this.TILE_CONNECTIONS[this.type]).filter((direction) => this.TILE_CONNECTIONS[this.type][direction]);
        }
        calculateNeighbours(type) {
            return {
                top: this.getMatchingTypes(type, Direction.top),
                right: this.getMatchingTypes(type, Direction.right),
                bottom: this.getMatchingTypes(type, Direction.bottom),
                left: this.getMatchingTypes(type, Direction.left),
            };
        }
        // Returns all tile types that can be connected by matching opposite directions states.
        getMatchingTypes(type, direction) {
            return Object.keys(this.TILE_CONNECTIONS)
                .map(Number)
                .filter((otherType) => {
                return ((this.TILE_CONNECTIONS[type][direction] &&
                    this.TILE_CONNECTIONS[otherType][this.oppositeDirection(direction)]) ||
                    (!this.TILE_CONNECTIONS[type][direction] &&
                        !this.TILE_CONNECTIONS[otherType][this.oppositeDirection(direction)]));
            });
        }
        oppositeDirection(direction) {
            const oppositeMap = {
                top: "bottom",
                right: "left",
                bottom: "top",
                left: "right",
            };
            return oppositeMap[direction];
        }
    }

    const drawGrid = (tiles, plane, TilesCount) => __awaiter(void 0, void 0, void 0, function* () {
        const loadImagePromises = tiles.map((tile) => {
            return new Promise((resolve) => {
                tile.image.onload = () => {
                    resolve(tile.image); // Resolving when image is loaded
                };
            });
        });
        // Helper array to store amount of possible neighbours for each cell.
        const helper = new Array(plane.length).fill(tiles.length);
        const upgradeNeighbours = (index, tile, dir) => {
            if (plane[index] !== undefined && Array.isArray(plane[index])) {
                // If cell is an array of possible neighbours, get unique matching neighbours.
                const possibleNeighbours = plane[index];
                plane[index] = tile.canTouch[dir].filter((item) => possibleNeighbours.includes(item));
                helper[index] = plane[index].length;
            }
            else if (plane[index] === undefined) {
                // If cell is undefined, assign possible neighbours from tile type.
                helper[index] = tile.canTouch[dir].length;
                plane[index] = tile.canTouch[dir];
            }
        };
        // Wait for all images to be loaded
        yield Promise.all(loadImagePromises);
        for (let i = 0; i < plane.length; i++) {
            let cell = -1;
            // First iteration, pick random cell and define all possible neighbours.
            if (i == 0) {
                cell = (Math.random() * plane.length) | 0;
                if (plane[cell] === undefined) {
                    plane[cell] = Object.keys(TileType).filter((type) => !isNaN(Number(type)));
                }
            }
            else {
                // Next iterations, pick cell with the smallest amount of possible neighbours.
                cell = helper.indexOf(Math.min(...helper));
            }
            let randomindex = -1;
            if (Array.isArray(plane[cell])) {
                // If cell is an array of possible neighbours, pick random tile from it.
                const planeCell = plane[cell];
                randomindex = (Math.random() * planeCell.length) | 0;
            }
            // Assign random tile to the cell. Disqualify index from further iterations.
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
    });

    (function () {
        if (typeof document === "undefined" || typeof window === "undefined") {
            return;
        }
        document.addEventListener("DOMContentLoaded", () => __awaiter(this, void 0, void 0, function* () {
            const canvas = document.querySelector("#maze");
            const PLAYER_SIZE_FACTOR = 0.15;
            const PLANE_SIZE = 10;
            const CELL_SIZE = canvas.width / PLANE_SIZE;
            const PLAYER_SIZE = CELL_SIZE * PLAYER_SIZE_FACTOR;
            const context = canvas.getContext("2d");
            context.imageSmoothingEnabled = false;
            const tileTypes = Object.keys(TileType).filter((type) => isNaN(Number(type)));
            const renderPlane = (plane) => {
                plane.forEach((tile, cell) => {
                    context.drawImage(tile.image, (cell % PLANE_SIZE) * CELL_SIZE, Math.floor(cell / PLANE_SIZE) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                });
            };
            const renderPlayer = (Player) => {
                context.fillStyle = "red";
                context.fillRect(CELL_SIZE * (Player.x + 0.5) - PLAYER_SIZE / 2, CELL_SIZE * (Player.y + 0.5) - PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
            };
            const Plane = new Array(PLANE_SIZE * PLANE_SIZE).fill(undefined);
            const Player = {
                x: Math.floor(PLANE_SIZE / 2),
                y: Math.floor(PLANE_SIZE / 2),
            };
            const updatePlayer = (direction) => {
                let currx = Player.x;
                let curry = Player.y;
                const currentPlayerTile = Plane[curry * PLANE_SIZE + currx];
                const allowedDriections = currentPlayerTile.getAllowedDirections();
                switch (direction) {
                    case Direction.top:
                        if (allowedDriections.indexOf(direction) != -1 && curry > 0) {
                            curry--;
                        }
                        break;
                    case Direction.right:
                        if (allowedDriections.indexOf(direction) != -1 &&
                            currx < PLANE_SIZE - 1) {
                            currx++;
                        }
                        break;
                    case Direction.bottom:
                        if (allowedDriections.indexOf(direction) != -1 &&
                            curry < PLANE_SIZE - 1) {
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
            const tiles = tileTypes.map((type) => new Tile(TileType[type], `./assets/tiles_colored/Tile${type}.png`));
            yield drawGrid(tiles, Plane, PLANE_SIZE);
            renderPlane(Plane);
            renderPlayer(Player);
            window.onkeypress = (event) => {
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
                }
                renderPlane(Plane);
                renderPlayer(Player);
            };
        }));
    })();

})();
