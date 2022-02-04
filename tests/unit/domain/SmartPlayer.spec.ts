import { Game } from '@/domain/Game'
import { HumanPlayer } from '@/domain/HumanPlayer'
import { SmartPlayer } from '@/domain/SmartPlayer'

describe('Makes optimal choices', () => {
    it('chooses best possible space in the beginning', () => {
        const smartPlayer = new SmartPlayer('O', 'Player2')
        const game = new Game(new HumanPlayer('X', 'Player1'), smartPlayer)
        game.checkCell(0)
        const chosenIndex = smartPlayer.makeMove(game)
        expect(chosenIndex).toEqual(4)
    })

    it('does not let opponent win', () => {
        const smartPlayer = new SmartPlayer('O', 'Player2')
        const game = new Game(new HumanPlayer('X', 'Player1'), smartPlayer)
        game.checkCell(0)
        game.checkCell(1)
        game.checkCell(3)
        const chosenIndex = smartPlayer.makeMove(game)
        expect(chosenIndex).toEqual(6)
    })
})
