/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-env jest */

module.exports = {
  require: jest.fn(),
  match: jest.fn(),
  app: {
    getPath: () => "src\\assets\\resources",
  },
  remote: {
    app: {
      getVersion: () => "1.0.0",
      getPath: jest.fn(),
    },
    screen: {
      getPrimaryDisplay: () => {
        return { bounds: { width: 800, height: 600, x: 0, y: 0 } };
      },
    },
  },
  ipcRenderer: {
    on: jest.fn(),
    send: jest.fn(),
  },
  dialog: jest.fn(),
};
