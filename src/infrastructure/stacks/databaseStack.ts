import { Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../utils';

export class DatabaseStack extends Stack {

  public readonly coffeeOrdersTable: Table;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    this.coffeeOrdersTable = new Table(this, 'CoffeeOrdersTable', {
      partitionKey: {
        name: 'CustomerName',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'CoffeeBlend',
        type: AttributeType.STRING
      },
      tableName: `CoffeeOrders-${suffix}`,
    });
  }
}