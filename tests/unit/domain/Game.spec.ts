import { Game } from '@/domain/Game'
import { HumanPlayer } from '@/domain/HumanPlayer'
import { Board } from '@/domain/Board'

describe('Maintains proper Game state', () => {
    it('will have no winner at the beginning', () => {
        const game = new Game(new HumanPlayer('X', 'Player1'), new HumanPlayer('O', 'Player2'))
        expect(game.board.uncheckedCell().length).toEqual(9)
    })

    it('will have proper uncheck cells', () => {
        const game = new Game(new HumanPlayer('X', 'Player1'), new HumanPlayer('O', 'Player2'))
        game.checkCell(0)
        expect(game.board.uncheckedCell().length).toEqual(8)
    })

    it('can detect row winner', () => {
        const game = new Game(new HumanPlayer('X', 'Player1'), new HumanPlayer('O', 'Player2'))
        game.board.checkCell(0, 'X')
        game.board.checkCell(1, 'X')
        game.board.checkCell(2, 'X')
        expect(game.getState().winner).toBeNull()
        game.board.checkCell(3, 'X')
        expect(game.getState().winner).toBeTruthy()
    })

    it('can detect column winner', () => {
        const game = new Game(new HumanPlayer('X', 'Player1'), new HumanPlayer('O', 'Player2'))
        game.board.checkCell(0, 'X')
        game.board.checkCell(3, 'X')
        game.board.checkCell(6, 'X')
        expect(game.getState().winner).toBeNull()
        game.board.checkCell(2, 'X')
        expect(game.getState().winner).toBeTruthy()
    })

    it('can detect diagonal winner', () => {
        const game = new Game(new HumanPlayer('X', 'Player1'), new HumanPlayer('O', 'Player2'))
        game.board.checkCell(0, 'X')
        game.board.checkCell(4, 'X')
        game.board.checkCell(8, 'X')
        expect(game.getState().winner).toBeNull()
        game.board.checkCell(2, 'X')
        expect(game.getState().winner).toBeTruthy()
    })

    it('will toggle player appropriately', () => {
        const game = new Game(new HumanPlayer('X', 'Player1'), new HumanPlayer('O', 'Player2'))
        expect(game.getState().currentMarker).toEqual('X')
        game.checkCell(0)
        expect(game.getState().currentMarker).toEqual('O')
    })

    it('can clone game properly', () => {
        const game = new Game(new HumanPlayer('X', 'Player1'), new HumanPlayer('O', 'Player2'))
        expect(game.getState().currentMarker).toEqual('X')
        game.checkCell(0)
        expect(game.getState().currentMarker).toEqual('O')
        expect(game.uncheckedCell().length).toEqual(8)
        const newGame = game.clone()
        expect(newGame.getState().currentMarker).toEqual('O')
        expect(newGame.uncheckedCell().length).toEqual(8)
    })

    it('cannot initialize with invalid marker', () => {
        expect(() => {
            new Game(new HumanPlayer('X', 'Player1'), new HumanPlayer('O', 'Player2'), new Board(), 'P')
        }).toThrow('Invalid marker')
    })

    it('both player cannot have same marker', () => {
        expect(() => {
            new Game(new HumanPlayer('X', 'Player1'), new HumanPlayer('X', 'Player2'), new Board(), 'P')
        }).toThrow('Both player marker cannot be same')
    })
})
