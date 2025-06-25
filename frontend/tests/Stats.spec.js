import { shallowMount, mount } from "@vue/test-utils";
import Stats from "@/components/Stats.vue";
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
        get: jest.fn().mockResolvedValue({ data: [] }),
        post: jest.fn()
    }
})

jest.mock('bootstrap', () => {
    const mockHide = jest.fn();
    const mockInstance = { hide: mockHide };
  
    const Modal = jest.fn(() => mockInstance);
    Modal.getInstance = jest.fn(() => null); // or return mockInstance
  
    return { Modal };
});

describe('Stats.vue', () => {
    const mockRouter = {
        push: jest.fn()
    };

    let wrapper = shallowMount(Stats, {
        props: {
            activeTab: 'game',
            user: null,
            statsTrigger: false
        },
        data() {
            return {
                games_played: 0,
                average_score: null,
                num_wins: 0,
                num_losses: 0,
                games: []
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
                fa: true
            }
        }
    })

    afterAll(() => {
        axios.get.mockClear();
    });

    it('Average score renders if its a valid number', async () => {
        expect(wrapper.html()).toContain('N/A');

        await wrapper.setData({
            average_score: '3.0000'
        })

        expect(wrapper.html()).toContain('3.00');
    })

    it('Each game in games array renders its own component', async () => {
        await wrapper.setData({
            games: [
                {
                    game_date: '2025-06-25T00:00:00.000Z',
                    id: 1,
                    num_correct: null
                },
                {
                    game_date: '2025-06-26T00:00:00.000Z',
                    id: 2,
                    num_correct: 4
                }
            ]
        })

        expect(wrapper.findAll('.stat').length).toBe(2);
        expect(wrapper.html()).toContain('2025-06-25');
        expect(wrapper.html()).toContain('2025-06-26');
        expect(wrapper.html()).toContain('4 / 10');
        expect(wrapper.html()).toContain('N/A');
    })

    it('getUserStats() and getIndividualGames() do nothing if user.id is not set', async () => {
        await wrapper.vm.getUserStats()
        await wrapper.vm.getIndividualGames()

        expect(axios.get).not.toHaveBeenCalled();
    })

    it('getUserStats() and getIndividualGames() set stats correctly if axios call made', async () => {
        axios.get.mockResolvedValueOnce({
            data: [
                {
                    games_played: 12,
                    avg_score: '3.00'
                }
            ]
        }).mockResolvedValueOnce({
            data: [
                {
                    game_date: '2025-06-26T00:00:00.000Z',
                    id: 2,
                    num_correct: 10
                },
                {
                    game_date: '2025-06-26T00:00:00.000Z',
                    id: 3,
                    num_correct: 9
                }
            ]
        })

        await wrapper.setProps({
            user: {
                id: 1
            }
        })

        expect(wrapper.vm.games_played).toBe(12);
        expect(wrapper.vm.average_score).toBe('3.00');
        expect(wrapper.vm.num_wins).toBe(1);
        expect(wrapper.vm.num_losses).toBe(1)
    })

    it('statsTrigger makes correct fn calls', async () => {
        wrapper.vm.getUserStats = jest.fn();
        wrapper.vm.getIndividualGames = jest.fn();

        await wrapper.setProps({
            statsTrigger: true
        })

        expect(wrapper.vm.getUserStats).toHaveBeenCalled();
        expect(wrapper.vm.getIndividualGames).toHaveBeenCalled();
    })
})