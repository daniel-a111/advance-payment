

# Alphabet Advance Payment

## Requirements
- docker + docker-compose

## Run the application
```
docker-compose up -d
```

## Configure environment
- FAILED_RATE_RANDOM - the random rate for black-box mock
- BANK_ACC - the src back account
- SQL_DEBUG - is logging sql queries
- REPAYMENT_SLOT - a week
- MISSING_TASK_DELAY_MS - delay on retry next task when previous task didn't exist
- PROCESSING_TIMEOUT - optional for handling timeout while processing
- POSTGRES_URI - the url for postgres

## Testing the application

Call ```perform_advance(dst_bank_account, amount)```
```http

POST http://127.0.0.1:3000/perform_advance HTTP/1.1
content-type: application/json

{
"dst_bank_account": "abc",
"amount": 2000
}

```

List task - future & historical


```http
GET http://127.0.0.1:3000/tasks HTTP/1.1
```

## Architecture Overview

### Credits
A singleton, used by RESTFUL controller, implemented on ```src/credits/index.ts```.

### Debits
A process that starting by:
```javascript
import * as processes from './processes';
processes.debits.start();
```
This process is a worker for debit tasks manager in ```src/debits/tasks.ts```

## Black Box implementation
An example for an implementation of processor (or the black box) on ```src/mock/processor.ts```

Defined while initiating ```Credits``` singleton:
```javascript
import * as credits from './credits';
import { MockProcessor } from './mock/processor';
credits.start(new MockProcessor(), 'SRC_BANK_ACCOUNT');
```
