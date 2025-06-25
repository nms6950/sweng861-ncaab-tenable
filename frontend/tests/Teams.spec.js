import { shallowMount, mount } from "@vue/test-utils";
import Teams from "@/components/Teams.vue";
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

describe('Teams.vue', () => {
    const mockRouter = {
        push: jest.fn()
    };

    let wrapper = shallowMount(Teams, {
        props: {
            activeTab: 'game',
        },
        data() {
            return {
                teamSelected: null,
                teams: []
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

    it('Nothing renders if teamSelected is truthy', async () => {
        await wrapper.setData({
            teamSelected: 'Illinois'
        })

        expect(wrapper.find('.teams-box').exists()).toBeFalsy();
        expect(wrapper.emitted().openPlayers).toBeTruthy();
    })

    it('each team in teams array renders its own component', async () => {
        await wrapper.setData({
            teamSelected: null,
            teams: [
                {
                    name: 'Illinois',
                    mascot: 'Fighting Illini',
                    city: 'Champaign, IL',
                    team_abbrev: 'ILL',
                    logo_src: null
                },
                {
                    name: 'Indiana',
                    mascot: 'Hoosiers',
                    city: 'Bloomington, IN',
                    team_abbrev: 'IND',
                    logo_src: null
                }
            ]
        })

        expect(wrapper.findAll('.team-card').length).toBe(2);
    })

    it('Team cards set teamSelected variable on click', async () => {
        await wrapper.find('.team-card').trigger('click');

        expect(wrapper.vm.teamSelected.name).toBe('Illinois');
    })
})