export const runEmits = (emits, params) =>
  emits.forEach((runEmit) => runEmit(params));

export const getEmit = (name, messages) => {
  const [, emit] = Object.entries(messages).find(([key]) => key === name) || [];

  if (!emit) return console.error('Invalid message name');

  return emit;
};
