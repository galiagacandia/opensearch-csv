import {describe, expect, test} from '@jest/globals';
import {Client} from "@opensearch-project/opensearch";
import {load_csv_file} from "./index";
import * as fs from "fs";


describe('opensearch-csv', function () {
    it('load_csv_file', async () => {
        fs.writeFileSync(
            "./test.csv",
            `id,name,age\n1,John,25\n2,Jane,24\n3,Jack,23`
        );
        const protocol:string = 'http';
        const host:string = 'localhost';
        const port:number = 9200;
        const auth:string = 'admin:admin';
        const client = new Client({
            node: protocol + '://' + auth + '@' + host + ':' + port,
        });
        const indexName = "drop-this-index";
        const filePath = "./test.csv";
        const result = await load_csv_file({ client, indexName, filePath });
        expect(result.count).toBe(3);
        expect(result.erroredDocuments).toEqual([]);
    });
    it('error load_csv_file', async () => {
        fs.writeFileSync(
            "./test.csv",
            `id,name,age\n1,John,25\n2,Jane,24\n3,Jack,23`
        );
        const protocol:string = 'http';
        const host:string = 'localhost';
        const port:number = 9200;
        const auth:string = 'admin:admin';
        const client = new Client({
            node: protocol + '://' + auth + '@' + host + ':' + port,  //"http://localhost:9200"
        });
        const indexName = "drop-this-index";
        const filePath = "./test.csv";
        const result = await load_csv_file({ client, indexName, filePath });
        expect(result.count).toBe(3);
        expect(result.erroredDocuments).toEqual([]);
    });
});