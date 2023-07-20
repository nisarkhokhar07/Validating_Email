# Validating_Emails

## Prerequisites

Before it makes sense to start a project, please make sure you have made the public folder in root directory of the project and inside it another folder named uploads with the following installed on your machine:

- ### Node

  See [Node](https://nodejs.org/en/download) for information on how to set it up.

- ### Postgres

  See [Postgres](https://www.postgresql.org/download/) for information on how to set it up.

- ### Python

  See [Python](https://www.python.org/downloads/) for information on how to set it up.

## Project Overview

This program can help validating emails present in an excel file under the column header `Email`.

It will append a new column of header `Valid` in the uploaded file available to be downloaded, which specifies either the corresponding email address is valid or not.
Moreover, the validated data will be pushed to the database.

## Getting Started

This is an example of how you may give instructions on setting up your project locally. To get a local copy up and running follow these simple example steps.

## Installation

Install the [node](https://nodejs.org/en/download) environemnt in your device. This program has been executed with the version 18.16.0. After cloning the repository, run the command **npm install** in the command line interface opened in your directory. If the _public_ folder with another folder _uploads_ inside it is present, it's fine else you have to make these folders.

Install the Postgres version 15 for the proper functioning of the code. After your database gets live the execution of the code will run smoothly.

Install the python version 3.6 or above in your device. After installing and setting up python, create a virtual environment. Activate the enviroment and run either the below command directly or execute _pip install -r srequirements.txt_.

```bash
pip install py3-validate-email==1.0.4
```

Versions of requirements for project:

```bash
Node = v18.17.0 or above
Python = v3.6 or above
Postgres = v15 or above
```

Make a .env file in your root directory, with the following variables:

```bash
USER_NAME =
PASSWORD =
DATABASE =
HOST =
DIALECT =
PORT =
```

Provide the username and password of your database server and all the required fields. Here, dialect in simple words is the type of the database.

`In the pythonfile.py, place your personal email address in variable **smtp_from_address**.`

## Folder Structure

The folder structure of the Email Validation app is as follows:

```bash
├── public
│   └── uploads
├── src
│   ├── config
│   │   ├── config.js
│   │   └── dbconfig.js
|   ├── controllers
│   │   ├── exportController.js
│   │   ├── exportNamesController.js
│   │   └── importController.js
│   ├── migrations
│   │   └── 202306201719-create-emails.js
│   ├── models
│   │   ├── emailresponse.js
│   │   └── index.js
|   ├── routes
│   │   ├── exportRoute.js
│   │   ├── filenamesRoute.js
│   │   └── importRoute.js
|   ├── services
│   │   ├── appendcolumn.js
│   │   ├── processCsvfile.js
│   │   ├── processxlsxfile.js
│   │   ├── pushdatatodb.js
│   │   ├── validatEmail.js
│   │   └── writefile.js
│   └── handleRoutes.js
├── .env
├── .env.template
├── .gitignore
├── .sequelizerc
├── app.js
├── package-lock.json
├── package.json
├── pythonfile.py
├── requirements.txt
└── README.md
```

## Endpoint: /importfile

### Description

This endpoint allows you to upload the file with the fieldname _file_.
It will also push the validated data to the database under the tablename _emailresponses_.

### Method

- `POST`: Uploads the file on server.

### Request

- Request URL: `/importfile`
- Request Method: `POST`
- Request Body : an excel file

## Endpoint: /exportfile

### Anatomy of an endpoint

The anatomy of an endpoint should look like this:

```
/exportfile?name=filename.extension
```

Below is a breakdown of the different pieces in the endpoint:

1. API would be prefixed with `/exportfile`.
2. `name` is used when we provide name of the file to be downloaded.
3. `filename.extension` would be the name of the file to be downloaded like `abc.csv`, the name of the file you have uploaded.

### Description

This endpoint allows you to download the updated _excel workbook_ with the name of the uploaded file. You also have to provide a query param _name_ with the value of filename you want to download.

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
| Mx         | boolean |             |
| created_at | date    |             |
| updated_at | date    |             |

# Acknowledgments

- [deep-email-validator](https://www.npmjs.com/package/deep-email-validator)
- [xlsx](https://www.npmjs.com/package/xlsx)
- [multer storage engine](https://www.npmjs.com/package/multer)
- [csv-parser](https://www.npmjs.com/package/csv-parser)
- [py3-email-validator](https://pypi.org/project/py3-validate-email/1.0.4/)
