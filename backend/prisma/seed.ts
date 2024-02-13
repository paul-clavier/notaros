import { PrismaClient } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
    const firstUser = await prisma.user.upsert({
        where: { email: "toto@school.com" },
        update: {},
        create: {
            email: "toto@school.com",
            password: bcrypt.hashSync("donotforget", 10),
            firstName: "Toto",
            lastName: "Zero",
        },
    });
    console.log({ firstUser });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
