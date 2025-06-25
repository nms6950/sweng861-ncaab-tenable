import { shallowMount, mount } from "@vue/test-utils";
import Home from "@/components/Home.vue";
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

describe('Home.vue', () => {
    const mockRouter = {
        push: jest.fn()
    };

    let wrapper = shallowMount(Home, {
        data() {
            return {
                user: null,
                activeTab: 'game',
                selectedTeam: null,
                statsTrigger: false
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

    beforeAll(() => {
        axios.get.mockClear();
    });

    it('Home.vue renders without errors', async () => {
        expect(true)
    })

    it('newUserCreated() sets user correctly', async () => {
        const newUser = {
            id: 2
        }

        await wrapper.vm.newUserCreated(newUser);

        expect(wrapper.vm.user).toEqual(newUser);
    })

    it('login() sets user correctly', async () => {
        const newUser = {
            id: 3
        }

        await wrapper.vm.login(newUser);

        expect(wrapper.vm.user).toEqual(newUser);
    })

    it('logout() sets user correctly', async () => {
        await wrapper.vm.logout();

        expect(wrapper.vm.user).toEqual(null);
    })

    it('triggerStats() sets statsTrigger correctly', async () => {
        await wrapper.vm.triggerStats();

        expect(wrapper.vm.statsTrigger).toEqual(true);
    })

    it('initTeamPlayers() sets variables correctly', async () => {
        const team = {
            id: 1
        }

        await wrapper.vm.initTeamPlayers(team);

        expect(wrapper.vm.selectedTeam).toEqual(team);
        expect(wrapper.vm.activeTab).toEqual('players');
    })

    it('Account component calls login on login event', async () => {
        const loginSpy = jest.fn();
        wrapper.vm.login = loginSpy;
    
        // Emit the login event with a dummy payload
        const accountComponent = wrapper.findComponent({ name: 'Account' });
        accountComponent.vm.$emit('login', { name: 'Test User' });
    
        // Let Vue process the event and re-render
        await wrapper.vm.$nextTick();
    
        expect(loginSpy).toHaveBeenCalled();
    })

    it('Account component calls logout on logout event', async () => {
        const logoutSpy = jest.fn();
        wrapper.vm.logout = logoutSpy;
    
        // Emit the login event with a dummy payload
        const accountComponent = wrapper.findComponent({ name: 'Account' });
        accountComponent.vm.$emit('logout', { name: 'Test User' });
    
        // Let Vue process the event and re-render
        await wrapper.vm.$nextTick();
    
        expect(logoutSpy).toHaveBeenCalled();
    })

    it('Game component calls triggerStats on resetStats event', async () => {
        await wrapper.setData({ activeTab: 'game' })
        const triggerStatsSpy = jest.fn();
        wrapper.vm.triggerStats = triggerStatsSpy;
    
        // Emit the login event with a dummy payload
        const gameComponent = wrapper.findComponent({ name: 'Game' });
        gameComponent.vm.$emit('resetStats', { name: 'Test User' });
    
        // Let Vue process the event and re-render
        await wrapper.vm.$nextTick();
    
        expect(triggerStatsSpy).toHaveBeenCalled();
    })

    it('CreateAccount component calls newUserCreated on newUser event', async () => {
        const newUserCreatedSpy = jest.fn();
        wrapper.vm.newUserCreated = newUserCreatedSpy;
    
        // Emit the login event with a dummy payload
        const createAccountComponent = wrapper.findComponent({ name: 'CreateAccount' });
        createAccountComponent.vm.$emit('newUser', { name: 'Test User' });
    
        // Let Vue process the event and re-render
        await wrapper.vm.$nextTick();
    
        expect(newUserCreatedSpy).toHaveBeenCalled();
    })

    it('Teams component renders if activeTab == teams', async () => {
        await wrapper.setData({ activeTab: 'teams' });
        
        const teamsComponent = wrapper.findComponent({ name: 'Teams' });
        expect(teamsComponent.exists()).toBe(true);
    })

    it('Teams component calls initTeamPlayers on openPlayers event', async () => {
        const initTeamPlayersSpy = jest.fn();
        wrapper.vm.initTeamPlayers = initTeamPlayersSpy;

        // Emit the login event with a dummy payload
        const teamsComponent = wrapper.findComponent({ name: 'Teams' });
        teamsComponent.vm.$emit('openPlayers', { name: 'Test User' });
    
        // Let Vue process the event and re-render
        await wrapper.vm.$nextTick();
    
        expect(initTeamPlayersSpy).toHaveBeenCalled();
    })

    it('Players component renders if activeTab == players', async () => {
        await wrapper.setData({ activeTab: 'players' });
        
        const playersComponent = wrapper.findComponent({ name: 'Players' });
        expect(playersComponent.exists()).toBe(true);
    })

})