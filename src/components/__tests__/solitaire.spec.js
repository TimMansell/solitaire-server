import { shallowMount } from '@vue/test-utils';
import Solitaire from '@/components/Solitaire.vue';

const mocks = {
  $store: { dispatch: jest.fn() },
};

describe('Solitaire.vue', () => {
  it('matches snapshot', () => {
    const wrapper = shallowMount(Solitaire, {
      mocks,
      computed: {
        showStats: () => true,
        showRules: () => true,
      },
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('shows stats overlay', () => {
    const wrapper = shallowMount(Solitaire, {
      mocks,
      computed: {
        showStats: () => true,
        showRules: () => false,
      },
    });

    expect(wrapper.find('[data-test="stats-overlay"]').exists()).toBe(true);
  });

  it('does not show stats overlay', () => {
    const wrapper = shallowMount(Solitaire, {
      mocks,
      computed: {
        showStats: () => false,
        showRules: () => false,
      },
    });

    expect(wrapper.find('[data-test="stats-overlay"]').exists()).toBe(false);
  });

  it('shows rules overlay', () => {
    const wrapper = shallowMount(Solitaire, {
      mocks,
      computed: {
        showStats: () => false,
        showRules: () => true,
      },
    });

    expect(wrapper.find('[data-test="rules-overlay"]').exists()).toBe(true);
  });

  it('does not show rules overlay', () => {
    const wrapper = shallowMount(Solitaire, {
      mocks,
      computed: {
        showStats: () => false,
        showRules: () => false,
      },
    });

    expect(wrapper.find('[data-test="rules-overlay"]').exists()).toBe(false);
  });
});