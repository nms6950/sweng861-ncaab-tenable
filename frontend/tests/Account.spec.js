import { shallowMount, mount } from "@vue/test-utils";
import Account from "@/components/Account.vue";
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
        get: jest.fn().mockImplementation(() => {
            return {
                data: []
            }
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

describe('Account.vue', () => {
    const mockRouter = {
        push: jest.fn()
    };

    let wrapper = shallowMount(Account, {
        data() {
            return {
                email: '',
                password: ''
            }
        },
        props: {
            user: null
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

    it('login() generates toast notification if password or email is empty', async () => {
        await wrapper.vm.login();

        expect(toast.error).toHaveBeenCalledTimes(1)
    })

    it('login() makes axios call and generates toast notification if error returned', async () => {
        axios.post.mockImplementationOnce(() => ({
            data: {
                error: 'error msg'
            }
        }))

        await wrapper.setData({
            password: 'test',
            email: 'test'
        })

        await wrapper.vm.login();

        expect(toast.error).toHaveBeenCalled();
    })

    it('login() makes axios call and emits event if login successful', async () => {
        axios.post.mockImplementationOnce(() => ({
            data: {
                
            }
        }))

        await wrapper.setData({
            password: 'test',
            email: 'test'
        })

        await wrapper.vm.login();

        expect(wrapper.emitted().login).toBeTruthy();
    })

    it('Login btn calls login on click', async () => {
        wrapper.vm.login = jest.fn();

        await wrapper.find('.btn-primary').trigger('click');

        expect(wrapper.vm.login).toHaveBeenCalled();
    })

    it('Logout btn emits event on click', async () => {
        await wrapper.setProps({
            user: {
                id: 2,
                name: 'Nathan'
            }
        })

        await wrapper.find('.btn-danger').trigger('click');

        expect(wrapper.emitted().logout).toBeTruthy();
    })
})