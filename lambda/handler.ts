import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

exports.handler = async (event: any) => {
    const tableName = process.env.TABLE_NAME!;
    const id = new Date().toISOString();

    const command = new PutItemCommand({
        TableName: tableName,
        Item: {
            id: { S: id },
            message: { S: "Hello from Lambda!" },
        },
    });

    await client.send(command);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Data written to DynamoDB!", id }),
    };
};
