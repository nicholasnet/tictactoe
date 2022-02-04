import { Player } from '@/domain/Player'
import { Game } from '@/domain/Game'
import { CellScore } from '@/domain/CellScore'
import { GameState } from '@/domain/GameState'

export class SmartPlayer implements Player {
    readonly marker: string
    readonly name: string

    constructor(marker: string, name = 'Computer') {
        this.marker = marker
        this.name = name
    }

    makeMove(game: Game): number {
        const { uncheckedCells } = game.getState()

        // If we are at the end state already then there is no point in doing any further evaluation.
        if (uncheckedCells.length === 1) {
            return uncheckedCells[0].index
        }
        return this.minimax(game).index
    }

    private minimax(game: Game, alpha = -Infinity, beta = Infinity): CellScore {
        const gameState = game.getState()

        if (gameState.winner !== null || gameState.draw) {
            return { index: -1, score: this.getScore(gameState) }
        }

        let maxCeil = { index: -1, score: -Infinity }
        let minCeil = { index: -1, score: Infinity }

        const { uncheckedCells } = gameState

        if (gameState.currentMarker === this.marker) {
            for (let i = 0; i < uncheckedCells.length; i++) {
                const newGame = game.clone()
                newGame.checkCell(uncheckedCells[i].index)
                const cellScore = this.minimax(newGame, alpha, beta)

                if (cellScore.score > maxCeil.score) {
                    maxCeil = { score: cellScore.score, index: uncheckedCells[i].index }
                }

                alpha = Math.max(alpha, maxCeil.score)

                if (beta <= alpha) {
                    break
                }
            }

            return maxCeil
        } else {
            for (let i = 0; i < uncheckedCells.length; i++) {
                const newGame = game.clone()
                newGame.checkCell(uncheckedCells[i].index)
                const cellScore = this.minimax(newGame, alpha, beta)

                if (cellScore.score < minCeil.score) {
                    minCeil = { score: cellScore.score, index: uncheckedCells[i].index }
                }

                beta = Math.min(beta, minCeil.score)

                if (beta <= alpha) {
                    break
                }
            }

            return minCeil
        }
    }

    private getScore(gameState: GameState): number {
        if (gameState.draw || gameState.winner === null) {
            return 0
        }

        const leftBlank = gameState.uncheckedCells.length
        return gameState.winner.marker === this.marker ? leftBlank + 100 : -1 * (leftBlank + 100)
    }
}
