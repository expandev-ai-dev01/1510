/**
 * @summary
 * Creates a new financial transaction with automatic UUID generation,
 * value conversion based on transaction type, and timestamp recording.
 *
 * @procedure spTransactionCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/transaction
 *
 * @parameters
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
 * @returns {VARCHAR(36)} Generated transaction UUID
 *
 * @testScenarios
 * - Valid creation with all required parameters
 * - Valid creation with optional description
 * - Validation failure for future date
 * - Validation failure for invalid category
 * - Validation failure for zero or negative value
 * - Validation failure for invalid transaction type
 */
CREATE OR ALTER PROCEDURE [functional].[spTransactionCreate]
  @type VARCHAR(10),
  @value NUMERIC(18, 6),
  @date DATE,
  @idCategory INTEGER,
  @description NVARCHAR(100) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @idTransaction VARCHAR(36);
  DECLARE @storedValue NUMERIC(18, 6);

  BEGIN TRY
    /**
     * @validation Required parameter validation
     * @throw {typeRequired}
     * @throw {valueRequired}
     * @throw {dateRequired}
     * @throw {categoryRequired}
     */
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
     * @validation Business rule validation
     * @throw {invalidTransactionType}
     * @throw {valueMustBePositive}
     * @throw {dateCantBeFuture}
     * @throw {categoryDoesntExist}
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

    /**
     * @validation Data consistency validation
     * @throw {categoryDoesntExist}
     */
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
      /**
       * @rule {fn-transaction-uuid-generation} Generate unique UUID for transaction
       */
      SET @idTransaction = LOWER(NEWID());

      INSERT INTO [functional].[transaction]
      ([idTransaction], [type], [value], [date], [idCategory], [description], [dateCreated])
      VALUES
      (@idTransaction, @type, @storedValue, @date, @idCategory, @description, GETUTCDATE());

      /**
       * @output {TransactionCreated, 1, 1}
       * @column {VARCHAR(36)} idTransaction
       * - Description: Generated transaction identifier
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
