import { Cell } from './Cell'

export class Board {
    readonly cells: Cell[] = []

    constructor() {
        let i = 0

        while (i < 9) {
            this.cells.push(new Cell(i))
            i += 1
        }
    }

    getCellByIndex(index: number): Cell {
        return this.cells[index]
    }

    markWinningCells(index: number) {
        const cell = this.getCellByIndex(index)
        this.cells[index] = new Cell(index, cell.getMarker(), true)
    }

    checkCell(index: number, marker: string) {
        this.cells[index] = new Cell(index, marker)
    }

    uncheckedCell(): Array<Cell> {
        return this.cells.filter((cell) => !cell.isOccupied())
    }

    checkedCell(): Array<Cell> {
        return this.cells.filter((cell) => cell.isOccupied())
    }

    getRows(): Array<Array<Cell>> {
        return [
            [this.cells[0], this.cells[1], this.cells[2]],
            [this.cells[3], this.cells[4], this.cells[5]],
            [this.cells[6], this.cells[7], this.cells[8]]
        ]
    }

    getColumns(): Array<Array<Cell>> {
        return [
            [this.cells[0], this.cells[3], this.cells[6]],
            [this.cells[1], this.cells[4], this.cells[7]],
            [this.cells[2], this.cells[5], this.cells[8]]
        ]
    }

    getDiagonals(): Array<Array<Cell>> {
        return [
            [this.cells[0], this.cells[4], this.cells[8]],
            [this.cells[2], this.cells[4], this.cells[6]]
        ]
    }
}
