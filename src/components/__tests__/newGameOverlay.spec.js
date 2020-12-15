import { shallowMount } from '@vue/test-utils';
import NewGameOverlay from '@/components/NewGameOverlay.vue';

describe('NewGameOverlay.vue', () => {
  it('matches snapshot', () => {
    const mocks = {
      $store: { dispatch: jest.fn() },
    };

    const wrapper = shallowMount(NewGameOverlay, {
      mocks,
    });

    expect(wrapper).toMatchSnapshot();
  });
});
