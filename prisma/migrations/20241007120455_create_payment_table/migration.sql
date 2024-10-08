-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "userNumber" TEXT,
    "userYear" INTEGER,
    "userCity" TEXT,
    "userName" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
