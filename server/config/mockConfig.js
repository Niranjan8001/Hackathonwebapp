let useMock = false;

export const setMockMode = (value) => {
  useMock = value;
  if (useMock) {
    console.log('⚡ Running in MOCK MODE (No Firebase / No MongoDB)');
  }
};

export const isMockMode = () => useMock || process.env.USE_MOCK === 'true';
