import { Game } from '@/domain/Game'
import { HumanPlayer } from '@/domain/HumanPlayer'

describe('Human player state', () => {
    it('human player cannot make move automatically', () => {
        const humanPlayer = new HumanPlayer('O', 'Player2')
        expect(() => {
            humanPlayer.makeMove(new Game(humanPlayer, new HumanPlayer('X', 'Player2')))
        }).toThrow('Not implemented')
    })
})
