import { shallowMount, mount } from "@vue/test-utils";
import Game from "@/components/Game.vue";
import { toast } from 'vue3-toastify';
import axios from 'axios';
import { Modal } from 'bootstrap'

// Mock toast from vue3-toastify
jest.mock('vue3-toastify', () => ({
    toast: {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn()
    }
}));

jest.mock('axios', () => {
    return {
        get: jest.fn().mockResolvedValueOnce({ data: {
            max: new Date()
        }}).mockResolvedValueOnce({
            data: []
        }).mockResolvedValueOnce({
            data: [{
                prompt: '',
                answerSet: '',
                answers: [],
                id: 0
            }]
        }),
        post: jest.fn()
    }
})

// Put these outside your test block to access them
const mockShow = jest.fn();

jest.mock('bootstrap', () => {
  return {
    Modal: jest.fn().mockImplementation(() => ({
      show: mockShow
    }))
  };
});

describe('Game.vue', () => {
    const mockRouter = {
        push: jest.fn()
    };

    let wrapper = shallowMount(Game, {
        data() {
            return {
                currentGame: {
                    prompt: '',
                    answerSet: '',
                    answers: [],
                    correct: [false, false, false, false, false, false, false, false, false, false],
                    checking: [false, false, false, false, false, false, false, false, false, false],
                    timer: 200,
                    id: 1
                },
                show: false,
                playerInput: '',
                checkingPlayer: '',
                date: null,
                numLives: 3,
                players: [],
                answerInterval: null,
                timerInterval: null,
                hoverTimer: false,
                isPaused: false,
                lastCheckingIndex: 0,
                maxDate: null,
                prevEnabled: false,
                nextEnabled: false,
                maxDate: null,
                num_correct: 0,
                gameStarted: false,
                timerInterval: null,
                gameEnded: false
            }
        },
        stubs: {
            fa: true
        },
        global: {
            mocks: {
                $router: mockRouter
            },
            stubs: {
                fa: true,
                Card: true,
                NavBar: true,
                UpdateShow: true,
                DeleteShow: true,
                NewShow: true
            }
        }

    })

    afterEach(() => {
        axios.get.mockClear();
        axios.post.mockClear();
    })

    it('mounted() makes correct fn calls', async () => {
        expect(axios.get).toHaveBeenCalledTimes(3);
    })

    it('startTimer() sets timerInterval correctly', async () => {
        await wrapper.vm.startTimer();
        expect(wrapper.vm.timerInterval).not.toBeNull();

        wrapper.setData({
            timerInterval: null
        })
    })

    it('startGame() sets variables and calls startTimer', async () => {
        wrapper.vm.startTimer = jest.fn().mockImplementationOnce(() => {
            return;
        })

        await wrapper.vm.startGame();

        expect(wrapper.vm.gameStarted).toBe(true);
        expect(wrapper.vm.startTimer).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.gameEnded).toBe(false)
    })

    it('togglePause() toggles isPaused', async () => {
        await wrapper.vm.togglePause();
        expect(wrapper.vm.isPaused).toBe(true);

        await wrapper.vm.togglePause();
        expect(wrapper.vm.isPaused).toBe(false);
    })

    it('handleBlur sets show variable for pause / timer', async () => {
        await wrapper.vm.handleBlur();
        expect(wrapper.vm.show).toBe(false);
    })

    it('clearGame() sets variables correctly', async () => {
        await wrapper.vm.clearGame();
        expect(wrapper.vm.gameStarted).toBe(false);
        expect(wrapper.vm.isPaused).toBe(false);
        expect(wrapper.vm.numLives).toBe(3);
        expect(wrapper.vm.lastCheckingIndex).toBe(0);
        expect(wrapper.vm.answerInterval).toBeNull();
        expect(wrapper.vm.timerInterval).toBeNull();
    })

    it('endGame() opens modal', async () => {
        await wrapper.vm.endGame();
        expect(mockShow).toHaveBeenCalledTimes(1);
    })

    it('check() sets variables correctly if index != 9 and the answer is wrong', async () => {
        const index = 0;

        await wrapper.setData({
            currentGame: {
                prompt: '',
                answerSet: '',
                answers: ['Nick Martinelli', '', '', '', '', '', '', '', '', ''],
                correct: [false, false, false, false, false, false, false, false, false, false],
                checking: [false, false, false, false, false, false, false, false, false, false],
                timer: 200,
                id: 0
            },
            playerInput: 'Dra Gibbs-Lawhorn'
        })

        await wrapper.vm.check(index);

        expect(wrapper.vm.currentGame.checking[index]).toBe(true);
        expect(wrapper.vm.currentGame.checking[index + 1]).toBeFalsy()
    })

    it('check() sets variables correctly if index != 9 and the answer is correct', async () => {
        const index = 0;

        await wrapper.setData({
            currentGame: {
                prompt: '',
                answerSet: '',
                answers: ['Nick Martinelli', '', '', '', '', '', '', '', '', ''],
                correct: [false, false, false, false, false, false, false, false, false, false],
                checking: [false, false, false, false, false, false, false, false, false, false],
                timer: 200,
                id: 1
            },
            playerInput: 'Nick Martinelli',
            numLives: 3,
            lastCheckingIndex: 0,
            num_correct: 0
        })

        await wrapper.vm.check(index);

        expect(wrapper.vm.currentGame.checking[index]).toBe(false);
        expect(wrapper.vm.currentGame.correct[index]).toBe(true);
        expect(wrapper.vm.numLives).toBe(3);
        expect(wrapper.vm.lastCheckingIndex).toBe(1);
        expect(wrapper.vm.num_correct).toBe(1);
    })

    it('saveStats() makes axios call and emits event', async () => {
        axios.post.mockResolvedValueOnce({ data: { message: 'Saved' } });
        axios.get.mockResolvedValueOnce({
            data: [{
                prompt: '',
                answerSet: '',
                answers: [],
                id: 0
            }]
        })

        await wrapper.setData({
            currentGame: {
                prompt: '',
                answerSet: '',
                answers: ['Nick Martinelli', '', '', '', '', '', '', '', '', ''],
                correct: [false, false, false, false, false, false, false, false, false, false],
                checking: [false, false, false, false, false, false, false, false, false, false],
                timer: 200,
                id: 1
            },
        })
        await wrapper.setProps({
            user: {
                id: 1
            }
        })

        await wrapper.vm.saveStats();
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(wrapper.emitted().resetStats).toBeTruthy();
    })

    it('endGame() calls saveStats if user is truthy', async () => {
        axios.post.mockResolvedValueOnce({ data: { message: 'Saved' } });
        axios.get.mockResolvedValueOnce({
            data: [{
                prompt: '',
                answerSet: '',
                answers: [],
                id: 0
            }]
        })
        
        wrapper.vm.saveStats = jest.fn();

        await wrapper.setProps({
            user: {
                id: 1
            }
        })

        await wrapper.vm.endGame();

        expect(wrapper.vm.saveStats).toHaveBeenCalledTimes(1);
    })

    it('check() sets variables correctly if index != 9 and the answer is correct and num_correct = 10', async () => {
        const index = 0;

        wrapper.vm.endGame = jest.fn();

        await wrapper.setData({
            currentGame: {
                prompt: '',
                answerSet: '',
                answers: ['Nick Martinelli', '', '', '', '', '', '', '', '', ''],
                correct: [false, false, false, false, false, false, false, false, false, false],
                checking: [false, false, false, false, false, false, false, false, false, false],
                timer: 200,
                id: 1
            },
            playerInput: 'Nick Martinelli',
            numLives: 3,
            lastCheckingIndex: 0,
            num_correct: 9,
            gameEnded: false
        })

        await wrapper.vm.check(index);

        expect(wrapper.vm.currentGame.checking[index]).toBe(false);
        expect(wrapper.vm.currentGame.correct[index]).toBe(true);
        expect(wrapper.vm.numLives).toBe(3);
        expect(wrapper.vm.lastCheckingIndex).toBe(1);
        expect(wrapper.vm.num_correct).toBe(10);
        expect(wrapper.vm.endGame).toHaveBeenCalledTimes(1);
    })

    it('check() calls endGame if index < 0 and num_lives = 0', async () => {
        const index = -1;

        wrapper.vm.endGame = jest.fn();

        await wrapper.setData({
            currentGame: {
                prompt: '',
                answerSet: '',
                answers: ['Nick Martinelli', '', '', '', '', '', '', '', '', ''],
                correct: [false, false, false, false, false, false, false, false, false, false],
                checking: [false, false, false, false, false, false, false, false, false, false],
                timer: 200,
                id: 1
            },
            playerInput: 'Nick Martinelli',
            numLives: 1,
            lastCheckingIndex: 0,
            num_correct: 9,
            gameEnded: false
        })

        await wrapper.vm.check(index);

        expect(wrapper.vm.endGame).toHaveBeenCalledTimes(1);
    })

    it('answer() makes correct fn calls', async () => {
        wrapper.vm.check = jest.fn();

        await wrapper.vm.answer();

        expect(wrapper.vm.check).toHaveBeenCalled();

        await wrapper.setData({
            answerInterval: null
        })
    })

    it('selectOption() sets variables and makes correct fn calls', async () => {
        wrapper.vm.answer = jest.fn();

        await wrapper.vm.selectOption({
            name: 'player'
        });

        expect(wrapper.vm.answer).toHaveBeenCalled();
        expect(wrapper.vm.playerInput).toBe('player');
        expect(wrapper.vm.checkingPlayer).toBe('player')
    })

    it('Previous game icon reduces the day by one, calls getGame()', async () => {
        wrapper.vm.clearGame = jest.fn();
        wrapper.vm.getGame = jest.fn();

        await wrapper.setData({
            prevEnabled: true
        })

        await wrapper.find('.icon').trigger('click')

        expect(wrapper.vm.clearGame).toHaveBeenCalled();
        expect(wrapper.vm.getGame).toHaveBeenCalled();
    })

    it('Next game icon increases the day by one, calls getGame()', async () => {
        wrapper.vm.clearGame = jest.fn();
        wrapper.vm.getGame = jest.fn();

        await wrapper.setData({
            prevEnabled: true,
            nextEnabled: true
        })

        await wrapper.findAll('.icon')[1].trigger('click')

        expect(wrapper.vm.clearGame).toHaveBeenCalled();
        expect(wrapper.vm.getGame).toHaveBeenCalled();
    })

    it('timer calls togglePause() on click', async () => {
        await wrapper.setData({
            gameStarted: true
        })

        wrapper.vm.togglePause = jest.fn();

        await wrapper.find('.timer').trigger('click');

        expect(wrapper.vm.togglePause).toHaveBeenCalled();
    })

    it('startGame btn calls startGame() on click', async () => {
        await wrapper.setData({
            gameStarted: false
        })

        wrapper.vm.startGame = jest.fn()

        await wrapper.find('.btn-primary').trigger('click');

        expect(wrapper.vm.startGame).toHaveBeenCalled()
    })

    it('activeTab calls clearGame() if newValue is not game', async () => {
        await wrapper.setProps({
            activeTab: 'players'
        })

        expect(wrapper.vm.clearGame).toHaveBeenCalled()
    })
})