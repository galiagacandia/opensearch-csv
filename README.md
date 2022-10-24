# opensearch-csv

Upload a CSV file to OpenSearch

## Installation

```sh
npm i opensearch-csv
```
## Dependencies

```sh
npm i @opensearch-project/opensearch

npm i csv-parse
```
## Usage

```ts
import {load_csv_file} from "opensearch-csv";
import {Client} from "@opensearch-project/opensearch";

(async () => {
  const result = await load_csv_file({
    client: new Client({ node: "http://admin:admin@localhost:9200" }),
    indexName: "my_index",
    filePath: "./data.csv",
  });

  console.log(result);
})();
```

