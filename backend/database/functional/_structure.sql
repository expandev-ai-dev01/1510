/**
 * @schema functional
 * Functional schema - business logic and transaction data
 */
CREATE SCHEMA [functional];
GO

/**
 * @table transaction Financial transactions (expenses and income)
 * @multitenancy false
 * @softDelete false
 * @alias trn
 */
CREATE TABLE [functional].[transaction] (
  [idTransaction] VARCHAR(36) NOT NULL,
  [type] VARCHAR(10) NOT NULL,
  [value] NUMERIC(18, 6) NOT NULL,
  [date] DATE NOT NULL,
  [idCategory] INTEGER NOT NULL,
  [description] NVARCHAR(100) NULL,
  [dateCreated] DATETIME2 NOT NULL
);

/**
 * @primaryKey pkTransaction
 * @keyType Object
 */
ALTER TABLE [functional].[transaction]
ADD CONSTRAINT [pkTransaction] PRIMARY KEY CLUSTERED ([idTransaction]);

/**
 * @foreignKey fkTransaction_Category Transaction category reference
 * @target config.category
 */
ALTER TABLE [functional].[transaction]
ADD CONSTRAINT [fkTransaction_Category] FOREIGN KEY ([idCategory])
REFERENCES [config].[category]([idCategory]);

/**
 * @check chkTransaction_Type Transaction type validation
 * @enum {despesa} Expense transaction
 * @enum {receita} Income transaction
 */
ALTER TABLE [functional].[transaction]
ADD CONSTRAINT [chkTransaction_Type] CHECK ([type] IN ('despesa', 'receita'));

/**
 * @check chkTransaction_Value Value must be non-zero
 */
ALTER TABLE [functional].[transaction]
ADD CONSTRAINT [chkTransaction_Value] CHECK ([value] <> 0);

/**
 * @default dfTransaction_DateCreated
 */
ALTER TABLE [functional].[transaction]
ADD CONSTRAINT [dfTransaction_DateCreated] DEFAULT (GETUTCDATE()) FOR [dateCreated];

/**
 * @index ixTransaction_Date Transaction date index for filtering
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTransaction_Date]
ON [functional].[transaction]([date]);

/**
 * @index ixTransaction_Category Transaction category index for filtering
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTransaction_Category]
ON [functional].[transaction]([idCategory]);

/**
 * @index ixTransaction_Type Transaction type index for filtering
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTransaction_Type]
ON [functional].[transaction]([type]);
GO
