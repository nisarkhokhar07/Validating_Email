# Validating_Emails

## Pre-requisites

- Install the [node](https://nodejs.org/en/download), more specifically version 18.16.0.
- Install the Postgres version 15 for the database server to get live, which by default is on port 5432.

## Description

This program can help validating emails present in an excel file under the column header **Email**.
It will append a new column of header _Valid_ which specifies either the corresponding email address is valid or not.
Moreover, the validated data will be pushed to the database.

The file will be uploaded to the server by hitting an endpoint of _/importfile_. The fieldname in the form where file be uploaded must be _file_.

To download the updated excel worksheet, another endpoint of _/exportfile_ must get hit.

## Getting Started

This is an example of how you may give instructions on setting up your project locally. To get a local copy up and running follow these simple example steps.

## Installation

Install the [node](https://nodejs.org/en/download) environemnt in your device. This program has been executed with the version 18.16.0. After cloning the repository, run the command **npm install** in the command line interface opened in your directory.

Install the Postgres version 15 for the proper functioning of the code. After your database gets live the execution of the code will run smoothly.

Make a .env file in your root directory, with the following variables:

```bash
USER_NAME =
PASSWORD =
DATABASE =
HOST =
DIALECT =
```

Provide the username and password of your database server, and all the required fields. Here, dialect in simple words is the type of the database.

## Endpoint: /importfile

### Description

This endpoint allows you to upload the file with the fieldname _file_.
It will also push the validated data to the database.

### Method

- `POST`: Uploads the file on server.

### Request

- Request URL: `/importfile`
- Request Method: `POST`
- Request Body : an excel file

## Endpoint: /exportfile

### Description

This endpoint allows you to download the updated _excel workbook_ with the name **file**.

### Method

- `GET`: Downloads the file on user's device.

### Request

- Request URL: `/exportfile`
- Request Method: `GET`

## Database Model

If your database server is live, your database model, as following, will be created automatically when the endpoint /importfile will get hit. The migrations will also run automatically behind the scenes.

### emailresponses

| Column     | Type    | Constraints |
| ---------- | ------- | ----------- |
| id         | integer | PRIMARY KEY |
| Email      | string  |             |
| Valid      | boolean |             |
| Reason     | string  |             |
| Typo       | boolean |             |
| Smtp       | boolean |             |
| Regex      | boolean |             |
| Disposible | boolean |             |
| Mx         | boolean |             |
| created_at | date    |             |
| updated_at | date    |             |

# Acknowledgments

- [deep-email-validator](https://www.npmjs.com/package/deep-email-validator)
- [xlsx](https://www.npmjs.com/package/xlsx)
- [multer storage engine](https://www.npmjs.com/package/multer)
