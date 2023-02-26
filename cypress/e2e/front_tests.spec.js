import SummaryTable from "./pageObjects/spot_vs_future/summary_table";
import BalancesTable from "./pageObjects/spot_vs_future/balances_table";
import TotalsTable from "./pageObjects/spot_vs_future/totals_table";
import { mainURL } from "../../constants";

describe("Frontend Tests", () => {
  const balances_table = new BalancesTable();
  const totals_table = new TotalsTable();
  const summary_table = new SummaryTable();

  beforeEach(() => {
    cy.visit(mainURL.preprod);
    summary_table.Login();
    cy.wait(5000);
    // cy.reload();
    // cy.wait(10000);
  });

  it("Check Balances Table", () => {
    let contracts = ["btc", "eth", "sol", "usdt20"];

    summary_table.SwitchToSnapshot();
    // balances_table.changeCurrency("BTC");
    balances_table.CheckBalancesHeaders();

    contracts.forEach((contract) => {
      balances_table.checkContract(contract);
      balances_table.checkAsset(contract);
      balances_table.checkBalance(contract);
      balances_table.checkCollateral(contract);
      balances_table.checkLong(contract);
      balances_table.checkShort(contract);
    });
  });

  it("Check Totals Table", () => {
    summary_table.SwitchToSnapshot();
    // For checking Loans, Balances, Collateral, Long, Short
    cy.log("CHECK Loans, Balances, Collateral, Long, Short");

    // Arrays for Group names in Total and Balances tables
    let groupsTotal = ["btc", "eth", "sol", "usdstablecoin"];
    let groups = ["BTC", "ETH", "SOL", "USD StableCoin"];

    groups.forEach((group, index) => {
      // Get Group name
      let groupTotal = groupsTotal[index];
      totals_table.checkTotals(groupTotal, group, 1, 16);
      totals_table.checkTotals(groupTotal, group, 2, 17);
      totals_table.checkTotals(groupTotal, group, 3, 18);
      totals_table.checkTotals(groupTotal, group, 4, 19);
      totals_table.checkTotals(groupTotal, group, 5, 20);
    });

    // Check Hedged Position for each Group in Totals table
    cy.log("CHECK Hedged Position");
    totals_table.checkHedgedPosition("usdstablecoin", [
      "usdt",
      "usdt20",
      "usdk",
      "usdc",
    ]);
    totals_table.checkHedgedPosition("btc", ["btc"]);
    totals_table.checkHedgedPosition("eth", ["eth", "eth-perp"]);
    totals_table.checkHedgedPosition("sol", ["sol"]);

    // Check UnhedgedPostion
    // totals_table.checkUnhedgedPosition(contract);

    // Check TotalPosition
    cy.log("CHECK Total Position");
    groupsTotal.forEach((groupTotal) => {
      totals_table.checkTotalPosition(groupTotal);
    });

    // Check HedgedMargin/UnhdgedMargin
    // totals_table.checkHedgedMargin(contract);
    // totals_table.checkUnhedgedMargin(contract);

    // Check MaintenanceMargin
    cy.log("CHECK Maintenance Margin");
    groupsTotal.forEach((groupTotal) => {
      totals_table.checkMaintenanceMargin(groupTotal);
    });
    // Check HedgedRatio/UnhedgedRatio
    // FIND OUT HOW TO CALCULATE IT. THE CURRENT FORMULA IS INCORRECT
    // groupsTotal.forEach((groupTotal) => {
    //   totals_table.checkRatio(groupTotal);
    // });
  });

  it("Check Summary Table", () => {
    summary_table.SwitchToSnapshot();
    summary_table.CheckSummaryHeaders();
    summary_table.CheckSummaryValues();
  });
});
