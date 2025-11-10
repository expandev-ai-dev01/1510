/**
 * @summary
 * Lists all available categories with optional filtering by type.
 * Returns predefined system categories and any user-created categories.
 *
 * @procedure spCategoryList
 * @schema config
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/category
 *
 * @parameters
 * @param {VARCHAR(10)} filterType
 *   - Required: No
 *   - Description: Filter by type ('todos', 'despesa', 'receita')
 *
 * @testScenarios
 * - List all categories without filter
 * - Filter categories by expense type
 * - Filter categories by income type
 * - Validation failure for invalid filter type
 */
CREATE OR ALTER PROCEDURE [config].[spCategoryList]
  @filterType VARCHAR(10) = 'todos'
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Business rule validation
   * @throw {invalidFilterType}
   */
  IF @filterType NOT IN ('todos', 'despesa', 'receita')
  BEGIN
    ;THROW 51000, 'invalidFilterType', 1;
  END;

  /**
   * @output {CategoryList, n, n}
   * @column {INT} idCategory
   * - Description: Category identifier
   * @column {NVARCHAR(30)} name
   * - Description: Category name
   * @column {VARCHAR(10)} type
   * - Description: Category type
   * @column {BIT} predefined
   * - Description: Indicates if system predefined
   */
  SELECT
    [cat].[idCategory],
    [cat].[name],
    [cat].[type],
    [cat].[predefined]
  FROM [config].[category] [cat]
  WHERE (
    @filterType = 'todos'
    OR [cat].[type] = @filterType
    OR [cat].[type] = 'ambos'
  )
  ORDER BY
    [cat].[predefined] DESC,
    [cat].[name] ASC;
END;
GO
