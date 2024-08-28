export const makeUUID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);

  // UUID 생성
  return `${s4()}${s4()}`;
};
