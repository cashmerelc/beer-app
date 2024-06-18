import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    /* Primary Colors */
  --color-primary-dark-blue: #0B4A7E;
  --color-primary-blue: #2A88B6;
  --color-primary-light-blue: #77BEE2;
  --color-primary-orange: #E98A2E;
  --color-primary-yellow: #F4D15A;
  --color-primary-green: #67A84E;
  --color-primary-dark-green: #4C783A;
  --color-primary-red: #D74A49;
  --color-primary-white: #FFFFFF;

  /* Background Colors */
  --color-bg-main: var(--color-primary-white);
  --color-bg-secondary: var(--color-primary-light-blue);
  --color-bg-accent: var(--color-primary-dark-blue);

  /* Text Colors */
  --color-text-main: var(--color-primary-dark-blue);
  --color-text-secondary: var(--color-primary-dark-green);
  --color-text-accent: var(--color-primary-orange);
  --color-text-light: var(--color-primary-white);

  /* Border Colors */
  --color-border: var(--color-primary-dark-green);
  --color-border-light: var(--color-primary-light-blue);

  /* Button Colors */
  --color-button-bg: var(--color-primary-green);
  --color-button-text: var(--color-primary-white);
  --color-button-hover-bg: var(--color-primary-dark-green);
  --color-button-hover-text: var(--color-primary-light-blue);

  /* Link Colors */
  --color-link: var(--color-primary-blue);
  --color-link-hover: var(--color-primary-dark-blue);

  /* Other Colors */
  --color-error: var(--color-primary-red);
  --color-success: var(--color-primary-green);
  }

  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
  }
`;

export default GlobalStyle;
