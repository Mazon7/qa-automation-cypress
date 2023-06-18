export const OPERATOR_SELECTORS = {
  EMAIL_INPUT_ADMIN: '[aria-label="Email"]',
  PASSWORD_INPUT_ADMIN: '[aria-label="Password"]',
  SIGN_IN_ADMIN: 'button[type="submit"]',
};

export const LOGIN_FORM_SELECTORS = {
  EMAIL_INPUT:
    ".inputs > :nth-child(1) > .PBInput > .PBInput__wrapper > .PBInput__input",
  PASSWORD_INPUT:
    ".inputs > :nth-child(2) > .PBInput > .PBInput__wrapper > .PBInput__input",
  SUBMIT_BUTTON: ".login-form__actions > .mb-24",
  TWOF_WINDOW: ".Popup__window",
  TWOF_SKIP: "button.mr-12.PBButton.bordered",
};

export const PORTFOLIO_TAB_SELECTORS = {};

export const LOANS_TAB_SELECTORS = {
  LOANS_TAB: ".PBTabs__top",
  TOTAL: ".total-assets",
  LTV_CHART: "canvas",
};

export const EARN_TAB_SELECTORS = {
  HISTORICAL: "",
  EARN_TAB: ".PBTabs__top",
};

export const TRADES_TAB_SELECTORS = {
  TAB: ".PBTabs__top",
  SEARCH: ".PBSearch > .PBIcon",
  SEARCH_FIELD: ".PBSearch__input > input",
  TABLE_TRADES: ".vs-table",
  FILTER: ".button",
  FILTER_DROPDOWN: ".PBSelect__dropdown",
  FILTER_DROPDOWN_SELECT: ".PBSelect__trigger",
  FILTER_DROPDOWN_EXCHANGE:
    ":nth-child(1) > .PBSelect__trigger > .PBSelect__placeholder",
  FILTER_DROPDOWN_INSTRUMENT:
    ":nth-child(1) > .PBSelect__trigger > .PBSelect__placeholder",
  DATE_RANGE: ".vc-appearance-none",
  DATE_PICKER:
    ".vc-grid-cell-col-1.vc-grid-cell-col--2 > .vc-pane > .vc-grid-container",
  APPLY: ".ml-12",
  DOWNLOAD_TRADES: ".download-csv-container ",
};

export const TRANSACTIONS_TAB_SELECTORS = {};

export const ACCOUNTS_TAB_SELECTORS = {
  ACCOUNTS_TAB: "",
  SEARCH: ".PBSearch > .PBIcon",
  SEARCH_FIELD: ".PBSearch__input > input",
  COLUNMN: ".tr-values > :nth-child(1)",
};

export const DASHBOARD_SELECTORS = {
  HEADER: ".Header__top",
  TRANSACTIONS_TAB: ".PBTabs__top",
  TABLE: ".Section--padded",
  ZOOM_CHART: ".area-chart-dates",
  ALLOCATION: ".Dashboard__allocation",
  LATEST: ".position-relative > .Section > .PBTabs > .PBTabs__top",
  PAGINATION: ".vs-pagination-wrapper",
  PAGINATION_NEXT: ".btn-next-pagination",
  PAGINATION_PREV: ".btn-prev-pagination",
};

export const WITHDRAW_WINDOW_SELECTORS = {
  BANK_ACCOUNT: ".test-select-withdraw-bank-account .test-select-trigger",
  BANK_DROPDOWN: ".test-select-withdraw-bank-account .test-select-dropdown",
  CURRENCY: ".test-select-withdraw-currency .test-select-trigger",
  CURRENCY_DROPDOWN: ".test-select-dropdown ",
  ADDRESS: ".test-select-withdraw-address .test-select-trigger",
  ADDRESS_DROPDOWN: ".test-select-withdraw-address .test-select-dropdown",
  ADDRESS_FROM_DROPDOWN: ".test-select-withdraw-address  li",
  AMOUNT: ".test-withdraw-amount input",
  ERROR_ZERO_AMOUNT: ".test-withdraw-amount .test-input-error",
  WITHDRAW_BUTTON: ".test-withdraw-submit",
  CLOSE_BUTTON: ".test-popup-close",
  WITHDRAW_VALIDATION: ".PBStatus",
  WITHDRAW_VALIDATION_CLOSE: ".PBStatus > .PBButton",
};
export const WITHDRAW_ADDRESSES_SELECTORS = {
  OPEN_ACCOUNT: '[class="PBIcon test-open-account-menu"]:first',
  DROPDOWN_ITEM: '[class="PBDropdown__item"]',
  WITHDRAW_ADDRESSES_HEADER: ".Section__top",
};

export const NEW_ADDRESS_WINDOW = {
  NEW_ADDRESS_HEADER: ".Popup__header",
  NOTIFICATION_MESSAGE: ".Popup__notification",
};
