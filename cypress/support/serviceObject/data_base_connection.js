require("dotenv").config();

class DBConnection {
  getStatusOfTransactionFromDB(expectedStatus, transactionID) {
    return new Promise((resolve) => {
      let connection = {
        user: process.env.USER_DB,
        host: process.env.HOST_DB,
        database: process.env.NAME_DB,
        password: process.env.PASS_DB,
        port: process.env.PORT_DB,
      };
      cy.task("DATABASE", {
        dbConfig: connection,
        sql: `
                    SELECT status FROM public.custody_transactions ct  where tx_id ='${transactionID}'
                    `,
      }).then((responce) => {
        cy.log(transactionID);
        cy.log(responce.rows[0]);
        if (responce.rows[0].status == expectedStatus) resolve(true);
        else resolve(false);
      });
    });
  }

  async waitUntillStatusWillBeChanged(transactionID, status, timeByMinute) {
    cy.wait(7000);

    let statusCorrect = false;
    for (let i = 0; i < (timeByMinute * 60) / 3; i++) {
      cy.wait(3000);
      if (
        (await this.getStatusOfTransactionFromDB(status, transactionID)) == true
      ) {
        statusCorrect = true;
        break;
      }
    }
    return statusCorrect;
  }
}
export default DBConnection;
