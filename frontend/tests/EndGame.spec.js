import { shallowMount, mount } from "@vue/test-utils";
import EndGame from "@/components/EndGame.vue";
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

describe('EndGame.vue', () => {
    const mockRouter = {
        push: jest.fn()
    };

    let wrapper = shallowMount(EndGame, {
        props: {
            num_correct: 2
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

    it('EndGame displays num_correct prop in html', async () => {
        expect(wrapper.html()).toContain('You scored 2 out of 10')
    })
    
})