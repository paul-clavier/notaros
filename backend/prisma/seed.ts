import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const firstUser = await prisma.user.upsert({
        where: { email: "toto@school.com" },
        update: {},
        create: {
            email: "toto@school.com",
            password: "donotforget",
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
