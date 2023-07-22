

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

