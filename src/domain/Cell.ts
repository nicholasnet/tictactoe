export class Cell {
    readonly marker: string
    readonly index: number
    readonly winningCell: boolean

    constructor(index: number, marker = '', winningCell = false) {
        this.marker = marker
        this.winningCell = winningCell
        this.index = index
    }

    getMarker(): string {
        return this.marker
    }

    isOccupied(): boolean {
        return this.marker !== ''
    }

    isWinningCell(): boolean {
        return this.winningCell
    }

    getIndex() {
        return this.index
    }
}
