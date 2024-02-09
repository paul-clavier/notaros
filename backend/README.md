# Notaros

# Install

```shell
npm install
```

## Prisma & DB

### prisma client

Generate a prisma client using

```shell
npx prisma generate
```

Then you need to start the database in order to use all prisma commands

### database

To start the database, you can use docker

```shell
docker compose up -d database
```

### migrations

Apply migrations to the database with the following command

```shell
npm run migrate:local
```

### seed

You can then populate the database with the seeds we created !

```shell
npm run seed:local
```

### studio

You can then open prisma studio to manipulate your database

```shell
npm run studio:local
```

# Run

Once you have setup the database and applied the migrations

### Node

```shell
npm run start
```

### Docker

```shell
docker compose up
```

## Login

To login on the app in the dev environment you can call the login endpoint with the credentials found in the `prisma/seed.ts` file,
and then use the `accessToken` provided as a Bearer Token. With swagger you can use this token to login.

# Test

```shell
# unit tests
npm run test

# e2e tests
npm run test:e2e
```

# Prisma

### Generate new migrations

When changing the data model you should run the following command to generate and apply the associated migration

```shell
npm run migrate -- --name "<NAME>"
```

# GitFlow

The `main` branch is protected. A Merge request has to be approved before it is merged into main. It is then automatically deployed with our CI/CD.
We build the image of the application on a registry. From there, a Portainer service receives a notification and deploys the new version of the image.

# Drone

We use drone for our CI/CD. We have two pipelines, one running at every new commit on a `pull_request`, and one whenever there is a push on `main` branch

# Mosquitto

When launching the application with docker, you can start a mosquitto container on which you can publish messages.
If you want to login to the container you can use as `user: user` and `password: password`
