import { Board } from '@/domain/Board'
import { GameState } from '@/domain/GameState'
import { Cell } from '@/domain/Cell'
import { Player } from '@/domain/Player'

export class Game {
    board: Board
    firstPlayer: Player
    secondPlayer: Player
    currentMarker: string

    constructor(firstPlayer: Player, secondPlayer: Player, board = new Board(), currentMarker = '') {
        this.board = board
        if (firstPlayer.marker.trim() === secondPlayer.marker.trim()) {
            throw new Error('Both player marker cannot be same')
        }
        if (currentMarker !== '' && currentMarker !== firstPlayer.marker && currentMarker !== secondPlayer.marker) {
            throw new Error('Invalid marker')
        }
        this.firstPlayer = firstPlayer
        this.secondPlayer = secondPlayer
        this.currentMarker = currentMarker === '' ? firstPlayer.marker : currentMarker // First player always goes first
    }

    getState(): GameState {
        const winner = this.winner()
        const uncheckedCells = this.uncheckedCell()
        const draw = uncheckedCells.length === 0 && winner === null
        const rows = this.board.getRows()
        const { currentMarker } = this

        return { winner, draw, rows, currentMarker, uncheckedCells }
    }

    uncheckedCell(): Array<Cell> {
        return this.board.uncheckedCell()
    }

    checkedCell(): Array<Cell> {
        return this.board.checkedCell()
    }

    checkCell(index: number): void {
        const cell = this.board.getCellByIndex(index)

        if (cell.isOccupied() || this.winner() !== null) {
            return
        }

        this.board.checkCell(index, this.currentMarker)
        this.currentMarker =
            this.currentMarker === this.firstPlayer.marker ? this.secondPlayer.marker : this.firstPlayer.marker
    }

    winner(): Player | null {
        if (this.checkedCell().length < 4) {
            return null
        }

        let result = false
        let winningMarker = ''

        const rows = this.board.getRows()

        // Check rows
        for (let i = 0; i < rows.length; i += 1) {
            if (rows[i][0].isOccupied() && rows[i][1].isOccupied() && rows[i][2].isOccupied()) {
                if (
                    rows[i][0].getMarker() === rows[i][1].getMarker() &&
                    rows[i][1].getMarker() === rows[i][2].getMarker()
                ) {
                    this.board.markWinningCells(rows[i][0].index)
                    this.board.markWinningCells(rows[i][1].index)
                    this.board.markWinningCells(rows[i][2].index)

                    result = true
                    winningMarker = rows[i][1].getMarker()

                    break
                }
            }
        }

        if (result) {
            return this.firstPlayer.marker === winningMarker ? this.firstPlayer : this.secondPlayer
        }

        // Check columns
        const columns = this.board.getColumns()

        for (let i = 0; i < columns.length; i += 1) {
            if (columns[i][0].isOccupied() && columns[i][1].isOccupied() && columns[i][2].isOccupied()) {
                if (
                    columns[i][0].getMarker() === columns[i][1].getMarker() &&
                    columns[i][1].getMarker() === columns[i][2].getMarker()
                ) {
                    this.board.markWinningCells(columns[i][0].index)
                    this.board.markWinningCells(columns[i][1].index)
                    this.board.markWinningCells(columns[i][2].index)

                    result = true
                    winningMarker = columns[i][1].getMarker()

                    break
                }
            }
        }

        if (result) {
            return this.firstPlayer.marker === winningMarker ? this.firstPlayer : this.secondPlayer
        }

        // Check diagonals
        const diagonals = this.board.getDiagonals()

        for (let i = 0; i < diagonals.length; i += 1) {
            if (diagonals[i][0].isOccupied() && diagonals[i][1].isOccupied() && diagonals[i][2].isOccupied()) {
                if (
                    diagonals[i][0].getMarker() === diagonals[i][1].getMarker() &&
                    diagonals[i][1].getMarker() === diagonals[i][2].getMarker()
                ) {
                    this.board.markWinningCells(diagonals[i][0].index)
                    this.board.markWinningCells(diagonals[i][1].index)
                    this.board.markWinningCells(diagonals[i][2].index)

                    result = true
                    winningMarker = diagonals[i][1].getMarker()

                    break
                }
            }
        }

        if (result) {
            return this.firstPlayer.marker === winningMarker ? this.firstPlayer : this.secondPlayer
        }

        return null
    }

    clone(): Game {
        const board = new Board()

        this.board.checkedCell().forEach((cell) => {
            board.checkCell(cell.index, cell.getMarker())
        })

        return new Game(this.firstPlayer, this.secondPlayer, board, this.currentMarker)
    }
}
