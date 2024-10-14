module.exports = {
  extends: ['@etchteam/stylelint-config'],
  rules: {
    'selector-no-qualifying-type': [true, { ignore: ['attribute'], severity: 'warning' }],
  }
};
