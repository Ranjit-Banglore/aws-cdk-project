import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

export class AwsCdkProjectStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const table = new dynamodb.Table(this, 'MyTable', {
            partitionKey: {name: 'id', type: dynamodb.AttributeType.STRING},
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        const lambdaFn = new NodejsFunction(this, 'MyLambda', {
            runtime: lambda.Runtime.NODEJS_18_X,
            entry: path.join(__dirname, '../lambda/handler.ts'),
            environment: {
                TABLE_NAME: table.tableName,
            },
        });

        table.grantReadWriteData(lambdaFn);


        // API Gateway

        const api = new apigateway.RestApi(this, 'LambdaApi', {
            restApiName: 'Lambda Dynamo API',
            description: 'API Gateway with Lambda and DynamoDB',
        });

        const lambdaIntegration = new apigateway.LambdaIntegration(lambdaFn);
        api.root.addMethod('GET', lambdaIntegration);
    }
}
