import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
    const email = 'seth@mail.com';
    await prisma.user.deleteMany({}).catch(() => {});
    const hashedPassword = await bcrypt.hash('asdfasdfasdf', 10);

    await prisma.user.create({
        data: {
            email,
            password: {
                create: {
                    hash: hashedPassword
                }
            },
            profile: {
                create: {
                    firstName: 'Seth',
                    lastName: 'Davis'
                }
            }
        }
    });

    console.log(`Database has been seeded. 🌱`);
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
