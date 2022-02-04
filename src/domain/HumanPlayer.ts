import { Player } from '@/domain/Player'
import { Game } from '@/domain/Game'

export class HumanPlayer implements Player {
    readonly marker: string
    readonly name: string

    constructor(marker: string, name: string) {
        this.marker = marker
        this.name = name
    }

    makeMove(game: Game): number {
        throw new Error('Not implemented')
    }
}
