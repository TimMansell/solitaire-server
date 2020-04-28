import { shallowMount } from '@vue/test-utils';
import NewGame from '@/components/NewGame.vue';

describe('NewGame.vue', () => {
  it('matches snapshot', () => {
    const wrapper = shallowMount(NewGame);

    expect(wrapper).toMatchSnapshot();
  });

  it('calls newGame when clicked', () => {
    const wrapper = shallowMount(NewGame);
    const mockFunction = jest.fn();

    wrapper.setMethods({ newGame: mockFunction });

    wrapper.find('[data-test="new-game-btn"]').trigger('click');

    expect(mockFunction).toHaveBeenCalled();
  });
});