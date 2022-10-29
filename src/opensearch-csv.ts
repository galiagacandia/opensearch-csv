import {Client} from "@opensearch-project/opensearch";
import {parse} from "csv-parse";
import * as fs from "fs";

interface ImportCsvOptions {
    client: Client;
    indexName: string;
    filePath: string;
}

/**
 * Upload a CSV file to OpenSearch, indicating the name of the index,
 * the client and the address of the CSV file.
 * @author Grover Aliaga Candia
 * @param options
 * @returns { count: string, { error: any; status: any; index: any; id: any; }[] }
 */
export async function load_csv_file(options: ImportCsvOptions) {
    const { client, indexName, filePath } = options;
    const fileContent = fs.readFileSync(filePath, "utf8");
    const parser = parse(fileContent, {
        columns: true,
        skip_empty_lines: false,
        cast_date: true
    });
    const records = [];
    for await (const record of parser) {
        records.push(record);
    }

    // Change documents to format requiered
    const body = records.flatMap((doc) => [{create: {_index: indexName}}, doc]);

    // Delete index
    try {
        await client.indices.delete({
            index: indexName
        });
    } catch (e) {}

    // Add documents in bulk
    const { body: bulkResponse } = await client.bulk({
        refresh: true,
        body
    });

    const erroredDocuments:{ error: any; status: any; index: any; id: any; }[] = [];
    if (bulkResponse.errors) {
        bulkResponse.items.forEach((item: { create: { error: any; status: any; _index: any; _id: any; }; }) => {
            if(item.create.error) {
                erroredDocuments.push({
                    status: item.create.status,
                    error: item.create.error,
                    index: item.create._index,
                    id: item.create._id
                });
            }
        });
    }

    const { body: countBody } = await client.count({ index: indexName });
    return {
        count: countBody.count,
        erroredDocuments,
    };
}