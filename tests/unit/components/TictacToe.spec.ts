import { shallowMount } from '@vue/test-utils'
import TictacToe from '@/components/TictacToe.vue'

describe('Tictac Toe component', () => {
    it('should display proper h1 text', () => {
        const msg = 'Tic Tac Toe'
        const wrapper = shallowMount(TictacToe)

        expect(wrapper.find('h1').text()).toEqual(msg)
    })
})
