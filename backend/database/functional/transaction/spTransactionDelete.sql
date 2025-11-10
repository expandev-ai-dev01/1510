/**
 * @summary
 * Permanently deletes a financial transaction from the system.
 * This operation cannot be undone.
 *
 * @procedure spTransactionDelete
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - DELETE /api/v1/internal/transaction/:id
 *
 * @parameters
 * @param {VARCHAR(36)} idTransaction
 *   - Required: Yes
 *   - Description: Transaction identifier
 *
 * @testScenarios
 * - Valid deletion of existing transaction
 * - Validation failure for non-existent transaction
 * - Validation failure for NULL transaction ID
 */
CREATE OR ALTER PROCEDURE [functional].[spTransactionDelete]
  @idTransaction VARCHAR(36)
AS
BEGIN
  SET NOCOUNT ON;

  BEGIN TRY
    /**
     * @validation Required parameter validation
     * @throw {transactionIdRequired}
     */
    IF @idTransaction IS NULL
    BEGIN
      ;THROW 51000, 'transactionIdRequired', 1;
    END;

    /**
     * @validation Data consistency validation
     * @throw {transactionDoesntExist}
     */
    IF NOT EXISTS (
      SELECT * FROM [functional].[transaction] [trn] WHERE [trn].[idTransaction] = @idTransaction
    )
    BEGIN
      ;THROW 51000, 'transactionDoesntExist', 1;
    END;

    BEGIN TRAN;
      /**
       * @rule {fn-transaction-hard-delete} Permanent deletion without soft delete
       */
      DELETE FROM [functional].[transaction]
      WHERE [idTransaction] = @idTransaction;

      /**
       * @output {TransactionDeleted, 1, 1}
       * @column {VARCHAR(36)} idTransaction
       * - Description: Deleted transaction identifier
       */
      SELECT @idTransaction AS [idTransaction];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO
