import { shallowMount, mount } from "@vue/test-utils";
import Navigation from "@/components/Navigation.vue";
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
        get: jest.fn(),
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

describe('Navigation.vue', () => {
    const mockRouter = {
        push: jest.fn()
    };

    let wrapper = shallowMount(Navigation, {
        props: {
            activeTab: 'game'
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

    beforeAll(() => {
        axios.get.mockClear();
    });

    it('Tenable nav item emits tab-change on click', async () => {
        await wrapper.findAll('a')[0].trigger('click');

        expect(wrapper.emitted()['tab-change']).toBeTruthy();
        expect(wrapper.emitted()['tab-change'][0]).toEqual(['game']);
    })

    it('Team Profiles nav item emits tab-change on click', async () => {
        await wrapper.setProps({
            activeTab: 'teams'
        })

        await wrapper.findAll('a')[1].trigger('click');

        expect(wrapper.emitted()['tab-change']).toBeTruthy();
        expect(wrapper.emitted()['tab-change'][1]).toEqual(['teams']);
    })

    it('Player Profiles nav item emits tab-change on click', async () => {
        await wrapper.setProps({
            activeTab: 'players'
        })
        await wrapper.findAll('a')[2].trigger('click');

        expect(wrapper.emitted()['tab-change']).toBeTruthy();
        expect(wrapper.emitted()['tab-change'][2]).toEqual(['players']);
    })
})