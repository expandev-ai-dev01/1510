/**
 * @schema config
 * Configuration schema - system-wide settings and categories
 */
CREATE SCHEMA [config];
GO

/**
 * @table category Predefined transaction categories
 * @multitenancy false
 * @softDelete false
 * @alias cat
 */
CREATE TABLE [config].[category] (
  [idCategory] INTEGER IDENTITY(1, 1) NOT NULL,
  [name] NVARCHAR(30) NOT NULL,
  [type] VARCHAR(10) NOT NULL,
  [predefined] BIT NOT NULL
);

/**
 * @primaryKey pkCategory
 * @keyType Object
 */
ALTER TABLE [config].[category]
ADD CONSTRAINT [pkCategory] PRIMARY KEY CLUSTERED ([idCategory]);

/**
 * @check chkCategory_Type Category type validation
 * @enum {despesa} Expense category
 * @enum {receita} Income category
 * @enum {ambos} Both expense and income
 */
ALTER TABLE [config].[category]
ADD CONSTRAINT [chkCategory_Type] CHECK ([type] IN ('despesa', 'receita', 'ambos'));

/**
 * @check chkCategory_Predefined Predefined flag validation
 * @enum {0} User-created category
 * @enum {1} System predefined category
 */
ALTER TABLE [config].[category]
ADD CONSTRAINT [chkCategory_Predefined] CHECK ([predefined] IN (0, 1));

/**
 * @default dfCategory_Predefined
 */
ALTER TABLE [config].[category]
ADD CONSTRAINT [dfCategory_Predefined] DEFAULT (1) FOR [predefined];

/**
 * @index uqCategory_Name Unique category name
 * @type Search
 * @unique true
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqCategory_Name]
ON [config].[category]([name]);
GO
