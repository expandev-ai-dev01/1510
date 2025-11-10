/**
 * @summary
 * Lists financial transactions with filtering by period, type, and category,
 * with configurable sorting options. Returns formatted values for display.
 *
 * @procedure spTransactionList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/transaction
 *
 * @parameters
 * @param {INT} month
 *   - Required: Yes
 *   - Description: Month for filtering (1-12)
 *
 * @param {INT} year
 *   - Required: Yes
 *   - Description: Year for filtering
 *
 * @param {VARCHAR(10)} filterType
 *   - Required: No
 *   - Description: Filter by type ('todos', 'despesas', 'receitas')
 *
 * @param {INT} filterCategory
 *   - Required: No
 *   - Description: Filter by category ID (NULL for all)
 *
 * @param {VARCHAR(20)} sortBy
 *   - Required: No
 *   - Description: Sort criteria ('data_desc', 'data_asc', 'valor_desc', 'valor_asc')
 *
 * @testScenarios
 * - List all transactions for current month
 * - Filter by transaction type (despesas/receitas)
 * - Filter by specific category
 * - Sort by date ascending/descending
 * - Sort by value ascending/descending
 * - Empty result for period without transactions
 * - Validation failure for invalid month/year
 */
CREATE OR ALTER PROCEDURE [functional].[spTransactionList]
  @month INTEGER,
  @year INTEGER,
  @filterType VARCHAR(10) = 'todos',
  @filterCategory INTEGER = NULL,
  @sortBy VARCHAR(20) = 'data_desc'
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {monthRequired}
   * @throw {yearRequired}
   */
  IF @month IS NULL
  BEGIN
    ;THROW 51000, 'monthRequired', 1;
  END;

  IF @year IS NULL
  BEGIN
    ;THROW 51000, 'yearRequired', 1;
  END;

  /**
   * @validation Business rule validation
   * @throw {invalidMonth}
   * @throw {invalidYear}
   * @throw {invalidFilterType}
   * @throw {invalidSortBy}
   */
  IF @month < 1 OR @month > 12
  BEGIN
    ;THROW 51000, 'invalidMonth', 1;
  END;

  IF @year < 1900 OR @year > 2100
  BEGIN
    ;THROW 51000, 'invalidYear', 1;
  END;

  IF @filterType NOT IN ('todos', 'despesas', 'receitas')
  BEGIN
    ;THROW 51000, 'invalidFilterType', 1;
  END;

  IF @sortBy NOT IN ('data_desc', 'data_asc', 'valor_desc', 'valor_asc')
  BEGIN
    ;THROW 51000, 'invalidSortBy', 1;
  END;

  /**
   * @validation Data consistency validation
   * @throw {categoryDoesntExist}
   */
  IF @filterCategory IS NOT NULL AND NOT EXISTS (
    SELECT * FROM [config].[category] [cat] WHERE [cat].[idCategory] = @filterCategory
  )
  BEGIN
    ;THROW 51000, 'categoryDoesntExist', 1;
  END;

  /**
   * @output {TransactionList, n, n}
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
  WHERE YEAR([trn].[date]) = @year
    AND MONTH([trn].[date]) = @month
    AND (
      @filterType = 'todos'
      OR (@filterType = 'despesas' AND [trn].[type] = 'despesa')
      OR (@filterType = 'receitas' AND [trn].[type] = 'receita')
    )
    AND (
      @filterCategory IS NULL
      OR [trn].[idCategory] = @filterCategory
    )
  ORDER BY
    CASE WHEN @sortBy = 'data_desc' THEN [trn].[date] END DESC,
    CASE WHEN @sortBy = 'data_asc' THEN [trn].[date] END ASC,
    CASE WHEN @sortBy = 'valor_desc' THEN ABS([trn].[value]) END DESC,
    CASE WHEN @sortBy = 'valor_asc' THEN ABS([trn].[value]) END ASC;
END;
GO
