module.exports = {
  // Typecheck
  "{apps,libs,tools}/**/*.{ts,tsx}": (files) => {
    return `nx affected --target=typecheck --files=${files.join(",")}`;
  },

  // Lint
  "{apps,libs,tools}/**/*.{js,ts,jsx,tsx,json}": (files) => {
    return `nx affected --target=lint --files=${files.join(",")}`;
  },

  // Stylelint
  "{apps,libs,tools}/**/*.{js,ts,jsx,tsx,json}": (files) => {
    return `nx affected --target=stylelint --files=${files.join(",")}`;
  },
};
