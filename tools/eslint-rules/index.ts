import * as NoStringsOutsideTextComponent from './rules/no-strings-outside-text-component/no-strings-outside-text-component';
import * as NoUntranslatedText from './rules/no-untranslated-text/no-untranslated-text';

module.exports = {
  rules: {
    [NoStringsOutsideTextComponent.RULE_NAME]:
      NoStringsOutsideTextComponent.rule,
    [NoUntranslatedText.RULE_NAME]: NoUntranslatedText.rule,
  },
};
