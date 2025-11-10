/**
 * @summary
 * Updates an existing financial transaction with value conversion
 * based on transaction type and validation of all business rules.
 *
 * @procedure spTransactionUpdate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - PUT /api/v1/internal/transaction/:id
 *
 * @parameters
 * @param {VARCHAR(36)} idTransaction
 *   - Required: Yes
 *   - Description: Transaction identifier
 *
 * @param {VARCHAR(10)} type
 *   - Required: Yes
 *   - Description: Transaction type ('despesa' or 'receita')
 *
 * @param {NUMERIC(18,6)} value
 *   - Required: Yes
 *   - Description: Transaction value (always positive input)
 *
 * @param {DATE} date
 *   - Required: Yes
 *   - Description: Transaction date (cannot be future)
 *
 * @param {INT} idCategory
 *   - Required: Yes
 *   - Description: Category identifier
 *
 * @param {NVARCHAR(100)} description
 *   - Required: No
 *   - Description: Transaction description
 *
 * @testScenarios
 * - Valid update with all parameters
 * - Valid update changing transaction type
 * - Validation failure for non-existent transaction
 * - Validation failure for future date
 * - Validation failure for invalid category
 * - Validation failure for zero or negative value
 */
CREATE OR ALTER PROCEDURE [functional].[spTransactionUpdate]
  @idTransaction VARCHAR(36),
  @type VARCHAR(10),
  @value NUMERIC(18, 6),
  @date DATE,
  @idCategory INTEGER,
  @description NVARCHAR(100) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @storedValue NUMERIC(18, 6);

  BEGIN TRY
    /**
     * @validation Required parameter validation
     * @throw {transactionIdRequired}
     * @throw {typeRequired}
     * @throw {valueRequired}
     * @throw {dateRequired}
     * @throw {categoryRequired}
     */
    IF @idTransaction IS NULL
    BEGIN
      ;THROW 51000, 'transactionIdRequired', 1;
    END;

    IF @type IS NULL
    BEGIN
      ;THROW 51000, 'typeRequired', 1;
    END;

    IF @value IS NULL
    BEGIN
      ;THROW 51000, 'valueRequired', 1;
    END;

    IF @date IS NULL
    BEGIN
      ;THROW 51000, 'dateRequired', 1;
    END;

    IF @idCategory IS NULL
    BEGIN
      ;THROW 51000, 'categoryRequired', 1;
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

    /**
     * @validation Business rule validation
     * @throw {invalidTransactionType}
     * @throw {valueMustBePositive}
     * @throw {dateCantBeFuture}
     * @throw {categoryDoesntExist}
     * @throw {descriptionTooLong}
     */
    IF @type NOT IN ('despesa', 'receita')
    BEGIN
      ;THROW 51000, 'invalidTransactionType', 1;
    END;

    IF @value <= 0
    BEGIN
      ;THROW 51000, 'valueMustBePositive', 1;
    END;

    IF @date > CAST(GETUTCDATE() AS DATE)
    BEGIN
      ;THROW 51000, 'dateCantBeFuture', 1;
    END;

    IF NOT EXISTS (SELECT * FROM [config].[category] [cat] WHERE [cat].[idCategory] = @idCategory)
    BEGIN
      ;THROW 51000, 'categoryDoesntExist', 1;
    END;

    IF @description IS NOT NULL AND LEN(@description) > 100
    BEGIN
      ;THROW 51000, 'descriptionTooLong', 1;
    END;

    /**
     * @rule {fn-transaction-value-conversion} Convert positive value to negative for expenses
     */
    SET @storedValue = CASE
      WHEN @type = 'despesa' THEN -ABS(@value)
      ELSE ABS(@value)
    END;

    BEGIN TRAN;
      UPDATE [functional].[transaction]
      SET
        [type] = @type,
        [value] = @storedValue,
        [date] = @date,
        [idCategory] = @idCategory,
        [description] = @description
      WHERE [idTransaction] = @idTransaction;

      /**
       * @output {TransactionUpdated, 1, 1}
       * @column {VARCHAR(36)} idTransaction
       * - Description: Updated transaction identifier
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
