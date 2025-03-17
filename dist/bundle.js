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
        calculateNeighbours(type) {
            return {
                top: this.getMatchingTypes(type, "top"),
                right: this.getMatchingTypes(type, "right"),
                bottom: this.getMatchingTypes(type, "bottom"),
                left: this.getMatchingTypes(type, "left"),
            };
        }
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

    const drawGrid = (context, tiles, plane, TilesCount, CellSize) => __awaiter(void 0, void 0, void 0, function* () {
        const loadImagePromises = tiles.map((tile) => {
            return new Promise((resolve) => {
                tile.image.onload = () => {
                    resolve(tile.image); // Resolving when image is loaded
                };
            });
        });
        const helper = new Array(plane.length).fill(undefined);
        const upgradeNeighbours = (index, tile, dir) => {
            if (helper[index] !== undefined && Array.isArray(helper[index])) {
                helper[index] = tile.canTouch[dir].filter((item) => helper[index].includes(item));
                plane[index] = helper[index].length;
            }
            else if (helper[index] === undefined) {
                plane[index] = tile.canTouch[dir].length;
                helper[index] = tile.canTouch[dir];
            }
        };
        // Wait for all images to be loaded
        yield Promise.all(loadImagePromises);
        for (let i = 0; i < plane.length; i++) {
            let cell = -1;
            if (i == 0) {
                cell = (Math.random() * plane.length) | 0;
                if (helper[cell] === undefined) {
                    helper[cell] = Object.keys(TileType).filter((type) => !isNaN(Number(type)));
                }
            }
            else {
                cell = plane.indexOf(Math.min(...plane));
            }
            const randomindex = (Math.random() * helper[cell].length) | 0;
            const tile = tiles[helper[cell][randomindex]];
            helper[cell] = tile;
            plane[cell] = 1000;
            context.drawImage(tile.image, (cell % TilesCount) * CellSize, Math.floor(cell / TilesCount) * CellSize, CellSize, CellSize);
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
    });

    (function () {
        if (typeof document === "undefined" || typeof window === "undefined") {
            return;
        }
        document.addEventListener("DOMContentLoaded", () => {
            const canvas = document.querySelector("#maze");
            const PLANE_SIZE = 7;
            const CELL_SIZE = canvas.width / PLANE_SIZE;
            const context = canvas.getContext("2d");
            context.imageSmoothingEnabled = false;
            const tileTypes = Object.keys(TileType).filter((type) => isNaN(Number(type)));
            const Plane = new Array(PLANE_SIZE * PLANE_SIZE).fill(tileTypes.length);
            const tiles = tileTypes.map((type) => new Tile(TileType[type], `./assets/tiles_colored/Tile${type}.png`));
            drawGrid(context, tiles, Plane, PLANE_SIZE, CELL_SIZE);
        });
    })();

})();
