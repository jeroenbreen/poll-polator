import { App } from "./App";
import { Party, VoteSetHeavy } from "../../../types";
import { getShell, getRibSizeForShell, getAreaInsideShell } from "./shell";
import { settings } from "./settings";

export class Cell {
    app: App;
    indexX: number;
    indexY: number;
    x: number;
    y: number;
    size: number;
    voteSets: VoteSetHeavy[];
    cellSize: number;

    constructor(
        app: App,
        indexX: number,
        indexY: number,
        x: number,
        y: number,
        size: number,
        cellSize: number
    ) {
        this.app = app;
        this.indexX = indexX;
        this.indexY = indexY;
        this.x = x;
        this.y = y;
        this.size = size;
        this.cellSize = cellSize;
        this.voteSets = [];
    }

    getNeighbour(distanceIndex: number) {
        const getCoordinatesForShell = (
            shell: number,
            distanceIndex: number
        ) => {
            let step = 0;
            const size = getRibSizeForShell(shell); // 3
            // we start north west inside the shell
            let x = -Math.floor(size / 2);
            let y = -Math.floor(size / 2); // -1, -1
            if (step === distanceIndex) {
                return { x, y };
            }
            // walking east
            for (let i = 1; i < size; i++) {
                x++;
                step++;
                if (step === distanceIndex) {
                    return { x, y };
                }
            }
            // walking south
            for (let i = 1; i < size; i++) {
                y++;
                step++;
                if (step === distanceIndex) {
                    return { x, y };
                }
            }
            // walking west
            for (let i = 1; i < size; i++) {
                x--;
                step++;
                if (step === distanceIndex) {
                    return { x, y };
                }
            }
            // walking north
            // skip the last step, because we are already at the start again
            for (let i = 1; i < size - 1; i++) {
                y--;
                step++;
                if (step === distanceIndex) {
                    return { x, y };
                }
            }

            return { x, y };
        };

        const shell = getShell(distanceIndex); // 0
        const areaInside = getAreaInsideShell(shell); // 0
        const distanceIndexInShell = distanceIndex - areaInside; // 0
        const coordinates = getCoordinatesForShell(shell, distanceIndexInShell); // [-1, -1]

        // console.log(
        //     distanceIndex,
        //     shell,
        //     areaInside,
        //     distanceIndexInShell,
        //     coordinates
        // );
        return this.app.getCellFromCoordinates(
            this.indexX + coordinates.x,
            this.indexY + coordinates.y
        );
    }

    addVoteSet(voteSet: VoteSetHeavy) {
        if (this.isEmpty() || this.voteSets[0].party === voteSet.party) {
            this.voteSets.push(voteSet);
        }
    }

    filledPercentage() {
        return (100 * this.getPopulation()) / this.cellSize;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.voteSets.length > 0 && this.doDraw()) {
            const voteSet = this.voteSets[0];
            if (voteSet.party) {
                let size, x, y;
                if (settings.notFullCells === "reduce") {
                    size = this.size * (this.filledPercentage() / 100);
                    x = this.x + (this.size - size) / 2;
                    y = this.y + (this.size - size) / 2;
                } else {
                    size = this.size;
                    x = this.x;
                    y = this.y;
                }
                ctx.fillStyle = voteSet.party.color;
                ctx.fillRect(x, y, size, size);
            }
        }
    }

    doDraw() {
        if (settings.notFullCells === "reduce") {
            return true;
        } else {
            return this.filledPercentage() > 50;
        }
    }

    getPopulation() {
        return this.voteSets.reduce((acc, voteSet) => {
            return acc + voteSet.votes;
        }, 0);
    }

    isEmpty() {
        return this.voteSets.length === 0;
    }

    // todo, maybe cache this
    // clear/reset on addVoteSet
    getSpace() {
        return this.cellSize - this.getPopulation();
    }

    matchesParty(party: Party) {
        if (this.isEmpty()) {
            return true;
        } else {
            return this.voteSets[0].party === party;
        }
    }

    log() {
        const voteSet = this.voteSets[0];
        if (voteSet) {
            if (voteSet.municipality && voteSet.party) {
                console.log(
                    voteSet.municipality.title + " " + voteSet.party.name
                );
            }
        }
    }
}