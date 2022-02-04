import { Game } from '@/domain/Game'

export interface Player {
    marker: string
    name: string
    makeMove(game: Game): number
}
