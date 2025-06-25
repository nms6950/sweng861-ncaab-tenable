import { shallowMount, mount } from "@vue/test-utils";
import Players from "@/components/Players.vue";
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

describe('Players.vue', () => {
    const mockRouter = {
        push: jest.fn()
    };

    let wrapper = shallowMount(Players, {
        props: {
            activeTab: 'game',
            selectedTeam: {
                name: 'Indiana'
            }
        },
        data() {
            return {
                search: null,
                teams: [],
                selected: '',
                players: []
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

    it('mounted() makes calls to getPlayers and getTeams', async () => {
        expect(axios.get).toHaveBeenCalledTimes(2);
    })

    it('Each player in filterPlayers() computed value renders its own component', async () => {
        await wrapper.setProps({
            selectedTeam: {
                name: 'Illinois'
            }
        })

        await wrapper.setData({
            players: [
                {
                    name: 'Kylan Boswell',
                    team_name: 'Illinois',
                    team_abbrev: 'ILL',
                    position_abbrev: 'G',
                    home_city: 'Champaign, Illinois',
                    year: 3,
                    abbrev: 'JR',
                    redshirt: false,
                    number: 4
                },
                {
                    name: 'Kylan Boswell',
                    team_name: 'Indiana',
                    team_abbrev: 'ILL',
                    position_abbrev: 'G',
                    home_city: 'Champaign, Illinois',
                    year: 3,
                    abbrev: 'JR',
                    redshirt: false,
                    number: 4
                }
            ]
        })

        expect(wrapper.findAll('.player-card').length).toBe(1)
    })

    it('getPlayerYear() returns redshirt abbrev correctly', async () => {
        const player = {
            name: 'Kylan Boswell',
            team_name: 'Illinois',
            team_abbrev: 'ILL',
            position_abbrev: 'G',
            home_city: 'Champaign, Illinois',
            year: 3,
            abbrev: 'JR',
            redshirt: true,
            number: 4
        }

        let response = await wrapper.vm.getPlayerYear(player)

        expect(response).toBe('R-JR')
    })

    it('FilteredPlayers returns based on selectedTeam and playerInput', async () => {
        await wrapper.setProps({
            selectedTeam: {
                name: 'Illinois'
            }
        })

        await wrapper.setData({
            players: [
                {
                    name: 'Kylan Boswell',
                    team_name: 'Illinois',
                    team_abbrev: 'ILL',
                    position_abbrev: 'G',
                    home_city: 'Champaign, Illinois',
                    year: 3,
                    abbrev: 'JR',
                    redshirt: false,
                    number: 4
                },
                {
                    name: 'Dra Gibbs-Lawhorn',
                    team_name: 'Illinois',
                    team_abbrev: 'ILL',
                    position_abbrev: 'G',
                    home_city: 'Champaign, Illinois',
                    year: 3,
                    abbrev: 'JR',
                    redshirt: false,
                    number: 4
                },
                {
                    name: 'Kylan Boswell',
                    team_name: 'Indiana',
                    team_abbrev: 'ILL',
                    position_abbrev: 'G',
                    home_city: 'Champaign, Illinois',
                    year: 3,
                    abbrev: 'JR',
                    redshirt: false,
                    number: 4
                }
            ],
            search: 'Dra'
        })

        expect(wrapper.findAll('.player-card').length).toBe(1);
    })
})