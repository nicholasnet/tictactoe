<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { Game } from '@/domain/Game'
import { HumanPlayer } from '@/domain/HumanPlayer'
import { GameState } from '@/domain/GameState'
import { Player } from '@/domain/Player'
import { SmartPlayer } from '@/domain/SmartPlayer'

const gameInitialized = ref(false)
const gameInitializationInProgress = ref(false)
let game: Game
let gameState = ref<GameState>()
const gameOptions = ref<number>(1)
const player1Name = ref<string>('Player 1')
const player2Name = ref<string>('Player 2')
const player1 = ref<Player>()
const player2 = ref<Player>()

const player1NameProcessed = computed(() => player1Name.value.trim())
const player2NameProcessed = computed(() => player2Name.value.trim())
const haveValidPlayer1Name = computed(
    () => !(player1NameProcessed.value === '' || player1NameProcessed.value === player2NameProcessed.value)
)
const haveValidPlayer2Name = computed(
    () => !(player2NameProcessed.value === '' || player1NameProcessed.value === player2NameProcessed.value)
)

const showMask = ref<boolean>(false)

function initializeGame() {
    gameInitializationInProgress.value = true
    nextTick().then(() => {
        if (gameOptions.value === 1) {
            player1.value = new HumanPlayer('X', player1Name.value)
            player2.value = new SmartPlayer('O')
            game = new Game(player1.value, player2.value)
        } else if (gameOptions.value === 2) {
            player1.value = new SmartPlayer('X')
            player2.value = new HumanPlayer('O', player2Name.value)
            game = new Game(player1.value, player2.value)
            const bestMove = player1.value?.makeMove(game)
            game.checkCell(bestMove)
            gameState.value = game.getState()
        } else {
            player1.value = new HumanPlayer('X', player1Name.value)
            player2.value = new HumanPlayer('O', player2Name.value)
            game = new Game(player1.value, player2.value)
        }

        gameState.value = game.getState()
        gameInitializationInProgress.value = false
        gameInitialized.value = true
    })
}

function startOver() {
    gameInitialized.value = false
}

function setMarker(index: number) {
    if (gameState.value?.winner !== null || gameState.value?.draw) {
        return
    }

    game.checkCell(index)
    gameState.value = game.getState()

    if (gameState.value?.winner !== null || gameState.value?.draw) {
        return
    }

    if (gameOptions.value === 1 && gameState.value?.currentMarker === 'O') {
        const bestMove = player2.value?.makeMove(game)
        if (bestMove !== undefined) {
            game.checkCell(bestMove)
        }
    } else if (gameOptions.value === 2 && gameState.value?.currentMarker === 'X') {
        const bestMove = player1.value?.makeMove(game)
        if (bestMove !== undefined) {
            game.checkCell(bestMove)
        }
    }

    gameState.value = game.getState()
}

watch(gameOptions, (currentGameOptions, prevGameOptions) => {
    if (player2NameProcessed.value === '') {
        player2Name.value = 'Player 2'
    }
})

watch(gameState, (currentGameState, prevGameState) => {
    const isGameOver = gameState.value?.winner === null || gameState.value?.draw === true
    if (gameOptions.value === 1 && gameState.value?.currentMarker === 'O' && !isGameOver) {
        showMask.value = true
        return
    }

    if (gameOptions.value === 2 && gameState.value?.currentMarker === 'X' && !isGameOver) {
        showMask.value = true
        return
    }
    showMask.value = false
})
</script>

<template>
    <h1 class="mt-6 text-3xl font-bold">Tic Tac Toe</h1>
    <div v-if="!gameInitialized" class="relative">
        <div
            v-show="gameInitializationInProgress"
            class="absolute left-0 top-0 flex flex h-full w-full items-center justify-center"
        >
            <div class="absolute left-0 top-0 flex h-full w-full bg-white opacity-50 dark:bg-transparent"></div>
            <div
                class="z-10 flex items-center rounded border-2 border-blue-500 bg-white py-2 px-4 shadow-lg dark:bg-gray-800"
            >
                <div class="mr-2 h-4 w-4 animate-spin rounded-full border-l-2 border-t-2 border-blue-500"></div>
                <div class="animate-pulse dark:text-gray-100">Initializing...</div>
            </div>
        </div>
        <form class="mt-4" @submit.prevent="initializeGame">
            <fieldset>
                <div>
                    <div class="text-xl font-medium">How you would like to play?</div>
                </div>
                <div class="mt-4 space-y-4">
                    <div class="flex items-center">
                        <input
                            id="game_option_1"
                            name="game_options"
                            type="radio"
                            :value="1"
                            v-model="gameOptions"
                            class="h-6 w-6 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label for="game_option_1" class="ml-3 block text-lg font-medium">
                            Human vs. Computer (Human plays first)
                        </label>
                    </div>
                    <div v-if="gameOptions === 1">
                        <div class="ml-9 flex w-1/2">
                            <div class="flex-1 pr-1">
                                <label for="player-1-human-first" class="block text-sm font-medium">Player 1</label>
                                <input
                                    type="text"
                                    name="player-1"
                                    v-model="player1Name"
                                    id="player-1-human-first"
                                    autocomplete="given-name"
                                    class="mt-1 block w-full rounded-md text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    v-bind:class="[
                                        haveValidPlayer1Name
                                            ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                            : 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                    ]"
                                />
                                <div
                                    class="text-sm text-red-500"
                                    v-if="
                                        player1NameProcessed.length !== 0 &&
                                        player1NameProcessed === player2NameProcessed
                                    "
                                >
                                    Name cannot be same
                                </div>
                                <div class="text-sm text-red-500" v-if="player1NameProcessed.length === 0">
                                    Cannot be blank
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <input
                            id="game_option_2"
                            name="game_options"
                            type="radio"
                            :value="2"
                            v-model="gameOptions"
                            class="h-6 w-6 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label for="game_option_2" class="ml-3 block text-lg font-medium">
                            Computer vs. Human (Computer plays first)
                        </label>
                    </div>
                    <div v-if="gameOptions === 2">
                        <div class="ml-9 flex w-1/2">
                            <div class="flex-1 pr-1">
                                <label for="player-1-computer-first" class="block text-sm font-medium">Player 1</label>
                                <input
                                    type="text"
                                    name="player-1"
                                    v-model="player1Name"
                                    id="player-1-computer-first"
                                    autocomplete="given-name"
                                    class="mt-1 block w-full rounded-md text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    v-bind:class="[
                                        haveValidPlayer1Name
                                            ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                            : 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                    ]"
                                />
                                <div
                                    class="text-sm text-red-500"
                                    v-if="
                                        player1NameProcessed.length !== 0 &&
                                        player1NameProcessed === player2NameProcessed
                                    "
                                >
                                    Name cannot be same
                                </div>
                                <div class="text-sm text-red-500" v-if="player1NameProcessed.length === 0">
                                    Cannot be blank
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <input
                            id="game_option_3"
                            name="game_options"
                            type="radio"
                            :value="3"
                            v-model="gameOptions"
                            class="h-6 w-6 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label for="game_option_3" class="ml-3 block text-lg font-medium"> Human vs. Human </label>
                    </div>
                    <div v-if="gameOptions === 3">
                        <div class="ml-9 flex">
                            <div class="flex-1 pr-1">
                                <label for="player-1" class="block text-sm font-medium">Player 1</label>
                                <input
                                    type="text"
                                    name="player-1"
                                    v-model="player1Name"
                                    id="player-1"
                                    autocomplete="given-name"
                                    class="mt-1 block w-full rounded-md text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    v-bind:class="[
                                        haveValidPlayer1Name
                                            ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                            : 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                    ]"
                                />
                                <div
                                    class="text-sm text-red-500"
                                    v-if="
                                        player1NameProcessed.length !== 0 &&
                                        player1NameProcessed === player2NameProcessed
                                    "
                                >
                                    Name cannot be same
                                </div>
                                <div class="text-sm text-red-500" v-if="player1NameProcessed.length === 0">
                                    Cannot be blank
                                </div>
                            </div>
                            <div class="flex-1 pl-1">
                                <label for="player-2" class="block text-sm font-medium">Player 2</label>
                                <input
                                    type="text"
                                    name="player-2"
                                    v-model="player2Name"
                                    id="player-2"
                                    autocomplete="given-name"
                                    class="mt-1 block w-full rounded-md text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    v-bind:class="[
                                        haveValidPlayer2Name
                                            ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                            : 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                    ]"
                                />
                                <div class="text-sm text-red-500" v-if="player2NameProcessed.length === 0">
                                    Cannot be blank
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>
            <button
                v-if="haveValidPlayer2Name && haveValidPlayer1Name && !gameInitializationInProgress"
                class="mx-auto mt-8 block w-1/2 rounded bg-blue-500 p-2 font-bold text-white transition duration-300 hover:shadow-xl hover:shadow-blue-500/50"
                type="submit"
            >
                Play
            </button>
        </form>
    </div>
    <div v-else class="relative">
        <div v-show="showMask" class="absolute top-0 left-0 h-full w-full"></div>
        <div class="mt-4 flex text-xl">
            <div
                class="flex w-1/2 flex-row items-center space-x-2 border-b-2 pr-2"
                :class="[gameState.currentMarker === 'X' ? 'border-gray-400' : 'border-transparent']"
            >
                <div class="w-12">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                        class="w-12 fill-current text-blue-500"
                    >
                        <path
                            d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"
                        />
                    </svg>
                </div>
                <div class="flex-1 truncate overflow-ellipsis">{{ player1.name }}</div>
            </div>
            <div
                class="flex w-1/2 flex-row items-center space-x-2 border-b-2 pl-2"
                :class="[gameState.currentMarker === 'O' ? 'border-gray-400' : 'border-transparent']"
            >
                <div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        class="w-12 fill-current text-green-600"
                    >
                        <path
                            d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"
                        />
                    </svg>
                </div>
                <div class="flex-1 truncate overflow-ellipsis">{{ player2.name.substr(0, 12) }}</div>
            </div>
        </div>
        <div class="flex h-88 flex-col pt-6 text-4xl sm:h-132 xl:h-136">
            <div
                v-for="(row, rowIndex) in gameState.rows"
                :key="'rows' + rowIndex"
                class="flex h-1/3 border-b-2 border-gray-400 last:border-b-0"
            >
                <div
                    v-for="(cell, columnIndex) in row"
                    :key="'rows' + rowIndex + 'column' + columnIndex"
                    class="flex w-1/3 items-center justify-center border-r-2 border-gray-400 last:border-r-0"
                    v-bind:class="{
                        'cursor-not-allowed': cell.isOccupied() || gameState.winner !== null,
                        'cursor-pointer': !(cell.isOccupied() || gameState.winner !== null),
                        'empty-hover': !cell.isOccupied() && gameState.winner === null,
                        'no-show': !cell.isOccupied() && gameState.winner !== null
                    }"
                    @click="setMarker(cell.getIndex())"
                >
                    <div
                        class="flex select-none justify-center"
                        v-bind:class="{
                            'opacity-50': gameState.winner !== null && !cell.isWinningCell(),
                            'scale-125': gameState.winner !== null && cell.isWinningCell()
                        }"
                    >
                        <svg
                            v-if="cell.isOccupied() && cell.getMarker() === 'X'"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 320 512"
                            class="w-1/3 fill-current text-blue-500"
                        >
                            <path
                                d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"
                            />
                        </svg>

                        <svg
                            v-if="cell.isOccupied() && cell.getMarker() === 'O'"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            class="w-1/3 fill-current text-green-600"
                        >
                            <path
                                d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"
                            />
                        </svg>
                        <svg
                            v-if="!cell.isOccupied() && gameState.currentMarker === 'X'"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 320 512"
                            class="w-1/3 fill-current text-blue-100 dark:opacity-25"
                        >
                            <path
                                d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"
                            />
                        </svg>
                        <svg
                            v-if="!cell.isOccupied() && gameState.currentMarker === 'O'"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            class="w-1/3 fill-current text-green-100 dark:opacity-25"
                        >
                            <path
                                d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-bold mt-4 flex justify-center text-3xl" v-if="gameState.winner !== null">
            <span class="mr-2 inline-block truncate">{{ gameState.winner.name }}</span>
            <span
                class="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-blue-500"
            >
                <span class="relative font-bold text-white">won</span> </span
            >&nbsp;!!!
        </div>
        <div class="text-bold mt-4 flex justify-center text-3xl" v-if="gameState.draw">Draw</div>
        <button
            class="mx-auto mt-8 block w-1/2 rounded bg-blue-500 p-2 font-bold text-white transition duration-300 hover:shadow-xl hover:shadow-blue-500/50"
            type="button"
            @click="startOver"
        >
            Start over
        </button>
    </div>
</template>
