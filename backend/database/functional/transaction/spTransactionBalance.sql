/**
 * @summary
 * Calculates balance summary for a specific period including total income,
 * total expenses, and net balance. Returns formatted values for display.
 *
 * @procedure spTransactionBalance
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/transaction/balance
 *
 * @parameters
 * @param {INT} month
 *   - Required: Yes
 *   - Description: Month for balance calculation (1-12)
 *
 * @param {INT} year
 *   - Required: Yes
 *   - Description: Year for balance calculation
 *
 * @testScenarios
 * - Calculate balance for period with transactions
 * - Calculate balance for period without transactions (returns zeros)
 * - Validation failure for invalid month/year
 */
CREATE OR ALTER PROCEDURE [functional].[spTransactionBalance]
  @month INTEGER,
  @year INTEGER
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
   */
  IF @month < 1 OR @month > 12
  BEGIN
    ;THROW 51000, 'invalidMonth', 1;
  END;

  IF @year < 1900 OR @year > 2100
  BEGIN
    ;THROW 51000, 'invalidYear', 1;
  END;

  /**
   * @output {BalanceSummary, 1, n}
   * @column {NUMERIC(18,6)} totalIncome
   * - Description: Sum of all income transactions
   * @column {NUMERIC(18,6)} totalExpenses
   * - Description: Absolute sum of all expense transactions
   * @column {NUMERIC(18,6)} balance
   * - Description: Net balance (income - expenses)
   */
  SELECT
    ISNULL(SUM(CASE WHEN [trn].[type] = 'receita' THEN [trn].[value] ELSE 0 END), 0) AS [totalIncome],
    ISNULL(ABS(SUM(CASE WHEN [trn].[type] = 'despesa' THEN [trn].[value] ELSE 0 END)), 0) AS [totalExpenses],
    ISNULL(SUM([trn].[value]), 0) AS [balance]
  FROM [functional].[transaction] [trn]
  WHERE YEAR([trn].[date]) = @year
    AND MONTH([trn].[date]) = @month;
END;
GO
