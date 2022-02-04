import { Cell } from '@/domain/Cell'
import { Player } from '@/domain/Player'

export interface GameState {
    winner: Player | null
    draw: boolean
    rows: Array<Array<Cell>>
    currentMarker: string
    uncheckedCells: Cell[]
}
