/**
 * @summary
 * Retrieves a single transaction by ID with category information
 * and formatted display value.
 *
 * @procedure spTransactionGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/transaction/:id
 *
 * @parameters
 * @param {VARCHAR(36)} idTransaction
 *   - Required: Yes
 *   - Description: Transaction identifier
 *
 * @testScenarios
 * - Valid retrieval with existing transaction ID
 * - Validation failure for non-existent transaction
 * - Validation failure for NULL transaction ID
 */
CREATE OR ALTER PROCEDURE [functional].[spTransactionGet]
  @idTransaction VARCHAR(36)
AS
BEGIN
  SET NOCOUNT ON;

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

  /**
   * @output {TransactionDetail, 1, n}
   * @column {VARCHAR(36)} idTransaction
   * - Description: Transaction identifier
   * @column {VARCHAR(10)} type
   * - Description: Transaction type
   * @column {NUMERIC(18,6)} value
   * - Description: Transaction value (stored with sign)
   * @column {NUMERIC(18,6)} displayValue
   * - Description: Absolute value for display
   * @column {DATE} date
   * - Description: Transaction date
   * @column {INT} idCategory
   * - Description: Category identifier
   * @column {NVARCHAR(30)} categoryName
   * - Description: Category name
   * @column {NVARCHAR(100)} description
   * - Description: Transaction description
   * @column {DATETIME2} dateCreated
   * - Description: Creation timestamp
   */
  SELECT
    [trn].[idTransaction],
    [trn].[type],
    [trn].[value],
    ABS([trn].[value]) AS [displayValue],
    [trn].[date],
    [trn].[idCategory],
    [cat].[name] AS [categoryName],
    [trn].[description],
    [trn].[dateCreated]
  FROM [functional].[transaction] [trn]
    JOIN [config].[category] [cat] ON ([cat].[idCategory] = [trn].[idCategory])
  WHERE [trn].[idTransaction] = @idTransaction;
END;
GO
